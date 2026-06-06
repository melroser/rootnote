"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/types/rootnote";
import { searchResultsUrl } from "@/lib/youtube";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtubeApi";
import {
  createDjVoice,
  registerActiveDjAudio,
  stopActiveDjVoice,
} from "@/lib/tts";

type Props = {
  track: Track;
  index: number;
  total: number;
  djConfigured: boolean;
  onAdvance: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTraceRoots: (track: Track) => void;
};

const SEARCH_FALLBACK_MS = 9000;
/** Video plays at this fraction of the user's slider level while the host talks. */
const DUCK_RATIO = 0.16;
const MIN_DUCK_VOLUME = 6;

export default function EpisodePlayer({
  track,
  index,
  total,
  djConfigured,
  onAdvance,
  onPrev,
  onNext,
  onTraceRoots,
}: Props) {
  const isSearch = track.playback === "search" || !track.videoId;
  const searchQuery = track.searchQuery ?? `${track.artist} ${track.title}`;

  const [djNotice, setDjNotice] = useState<string | null>(null);

  const containerNodeRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const cuedIdRef = useRef<string | null>(null);
  const djAudioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const userYtVolumeRef = useRef(100);
  const isDuckedRef = useRef(false);
  const playbackGenRef = useRef(0);
  const pendingSongPlayRef = useRef(false);
  const lastStartedKeyRef = useRef<string | null>(null);

  const isSearchRef = useRef(isSearch);
  const trackRef = useRef(track);
  const djConfiguredRef = useRef(djConfigured);
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    isSearchRef.current = isSearch;
    trackRef.current = track;
    djConfiguredRef.current = djConfigured;
    onAdvanceRef.current = onAdvance;
  });

  function stopDjAudio() {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    stopActiveDjVoice();
    if (djAudioRef.current) {
      djAudioRef.current.onended = null;
      try {
        djAudioRef.current.pause();
      } catch {
        /* ignore */
      }
      djAudioRef.current = null;
    }
    restoreYoutubeVolume();
  }

  function syncYtVolume() {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;
    try {
      const v = player.getVolume();
      // Only mirror the slider when not ducked — otherwise we'd save the lowered level.
      if (typeof v === "number" && v >= 0 && !isDuckedRef.current) {
        userYtVolumeRef.current = v;
      }
    } catch {
      /* ignore */
    }
  }

  function duckYoutube() {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current || isSearchRef.current) return;
    try {
      syncYtVolume();
      isDuckedRef.current = true;
      const ducked = Math.max(
        MIN_DUCK_VOLUME,
        Math.round(userYtVolumeRef.current * DUCK_RATIO)
      );
      player.setVolume(ducked);
    } catch {
      /* ignore */
    }
  }

  function restoreYoutubeVolume() {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current || isSearchRef.current) return;
    if (!isDuckedRef.current) return;
    try {
      isDuckedRef.current = false;
      player.setVolume(userYtVolumeRef.current);
    } catch {
      /* ignore */
    }
  }

  function playTrackVideo(videoId: string) {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current || !videoId) return false;
    try {
      cuedIdRef.current = videoId;
      player.loadVideoById(videoId);
      player.unMute();
      player.setVolume(userYtVolumeRef.current);
      return true;
    } catch {
      return false;
    }
  }

  function startVideo() {
    if (isSearchRef.current) return;
    const videoId = trackRef.current.videoId;
    if (!videoId) return;
    if (!playerReadyRef.current) {
      pendingSongPlayRef.current = true;
      cuedIdRef.current = videoId;
      return;
    }
    pendingSongPlayRef.current = false;
    playTrackVideo(videoId);
  }

  function scheduleSearchAdvance() {
    if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(() => {
      onAdvanceRef.current();
    }, SEARCH_FALLBACK_MS);
  }

  function playDjVoice(gen: number) {
    const script = trackRef.current.hostScript;
    const search = isSearchRef.current;

    createDjVoice(script)
      .then((audio) => {
        if (
          gen !== playbackGenRef.current ||
          trackRef.current.hostScript !== script
        ) {
          try {
            audio.pause();
          } catch {
            /* ignore */
          }
          return;
        }
        setDjNotice(null);
        djAudioRef.current = audio;
        registerActiveDjAudio(audio);
        audio.onended = () => {
          if (gen !== playbackGenRef.current) return;
          djAudioRef.current = null;
          registerActiveDjAudio(null);
          restoreYoutubeVolume();
          if (search) onAdvanceRef.current();
        };
        duckYoutube();
        audio.play().catch(() => {
          if (gen !== playbackGenRef.current) return;
          restoreYoutubeVolume();
          if (search) scheduleSearchAdvance();
        });
      })
      .catch((err: unknown) => {
        if (gen !== playbackGenRef.current) return;
        restoreYoutubeVolume();
        setDjNotice(
          (err instanceof Error ? err.message : "DJ voice unavailable") +
            " — playing songs only"
        );
        if (search) scheduleSearchAdvance();
      });
  }

  /** Video + host voice together — same flow for Next, Prev, queue, and auto-advance. */
  function playTrack() {
    stopDjAudio();
    const gen = ++playbackGenRef.current;
    const search = isSearchRef.current;

    startVideo();

    if (djConfiguredRef.current) {
      playDjVoice(gen);
    } else if (search) {
      scheduleSearchAdvance();
    }
  }

  const createPlayer = useCallback(async (host: HTMLDivElement) => {
    if (playerRef.current) return;
    const YT = await loadYouTubeApi();
    if (containerNodeRef.current !== host) return;
    const target = document.createElement("div");
    host.appendChild(target);
    const startId = trackRef.current.videoId;
    playerRef.current = new YT.Player(target, {
      videoId: startId || undefined,
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onReady: () => {
          playerReadyRef.current = true;
          cuedIdRef.current = startId || null;
          syncYtVolume();
          if (pendingSongPlayRef.current) {
            pendingSongPlayRef.current = false;
            playTrackVideo(trackRef.current.videoId);
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) syncYtVolume();
          if (event.data === YT.PlayerState.ENDED) {
            onAdvanceRef.current();
          }
        },
      },
    });
  }, []);

  function destroyPlayer() {
    stopDjAudio();
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    }
    playerReadyRef.current = false;
    cuedIdRef.current = null;
    lastStartedKeyRef.current = null;
  }

  const containerCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerNodeRef.current = node;
      if (node) void createPlayer(node);
      else destroyPlayer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createPlayer]
  );

  useEffect(() => {
    const key = `${index}:${track.videoId ?? "search"}:${isSearch}:${djConfigured}`;
    if (lastStartedKeyRef.current === key) return;
    lastStartedKeyRef.current = key;
    playTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track.videoId, isSearch, djConfigured]);

  useEffect(() => {
    return () => {
      stopDjAudio();
    };
  }, []);

  return (
    <section className="rn-panel rn-player">
      <div className="rn-now-playing-bar">
        <span className="rn-npb-counter">
          Track {index + 1} of {total}
        </span>
        <span className="rn-npb-title">{track.title}</span>
        <span className="rn-npb-artist">{track.artist}</span>
        <span className="rn-npb-guided">
          <span className="rn-radio-dot" aria-hidden="true" />
          On air
        </span>
        {djNotice && <span className="rn-npb-notice">{djNotice}</span>}
      </div>

      <div className="rn-player-frame">
        {isSearch ? (
          <a
            className="rn-search-card"
            href={searchResultsUrl(searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="rn-search-glyph" aria-hidden="true">
              ♪
            </span>
            <span className="rn-search-label">AI pick · no fixed video</span>
            <span className="rn-search-track">
              {track.artist} — {track.title}
            </span>
            <span className="rn-btn rn-btn-accent rn-search-cta">
              ▶ Search on YouTube
            </span>
            <span className="rn-search-hint">
              Host plays over this pick, then the show moves to the next track.
            </span>
          </a>
        ) : (
          <div ref={containerCallbackRef} className="rn-yt-host" />
        )}
      </div>

      <div className="rn-visualizer rn-visualizer-live" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${(i % 14) * 0.08}s` }} />
        ))}
      </div>

      <div className="rn-commentary">
        <span className="rn-section-label">Host commentary</span>
        <p>{track.hostScript}</p>
      </div>

      <div className="rn-player-controls">
        <button type="button" className="rn-btn rn-btn-ghost" onClick={onPrev}>
          ← Previous
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-secondary"
          onClick={() => onTraceRoots(track)}
        >
          Trace roots
        </button>
        <button type="button" className="rn-btn rn-btn-ghost" onClick={onNext}>
          Next →
        </button>
      </div>
    </section>
  );
}

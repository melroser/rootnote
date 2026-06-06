"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Episode,
  EpisodeVisualTheme,
  MusicConnection,
  SavedEpisode,
  Track,
} from "@/types/rootnote";
import {
  findCuratedEpisode,
  generateEpisode,
  getDeepDive,
  miamiBassEpisode,
} from "@/lib/demoEpisode";
import { generateEpisodeRemote } from "@/lib/generate";
import { resolveEpisodeVideoIds } from "@/lib/resolveYouTube";
import { themes } from "@/lib/themes";
import {
  deleteEpisode,
  loadSavedEpisodes,
  saveEpisode,
} from "@/lib/storage";
import { isDjVoiceConfigured } from "@/lib/tts";
import Link from "next/link";
import GeneratorPanel from "@/components/GeneratorPanel";
import EpisodeSummary from "@/components/EpisodeSummary";
import EpisodePlayer from "@/components/EpisodePlayer";
import TrackQueue from "@/components/TrackQueue";
import RootsPanel from "@/components/RootsPanel";
import DeepDivePanel from "@/components/DeepDivePanel";
import SavedEpisodes from "@/components/SavedEpisodes";

function themeToStyle(theme: EpisodeVisualTheme): React.CSSProperties {
  return {
    "--background": theme.background,
    "--panel": theme.panel,
    "--accent": theme.accent,
    "--secondary-accent": theme.secondaryAccent,
    "--text": theme.text,
    "--muted-text": theme.mutedText,
  } as React.CSSProperties;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rootsTrack, setRootsTrack] = useState<Track | null>(null);
  const [deepDiveNode, setDeepDiveNode] = useState<MusicConnection | null>(null);
  const [saved, setSaved] = useState<SavedEpisode[]>([]);
  const [savedNodeIds, setSavedNodeIds] = useState<string[]>([]);
  const [djConfigured, setDjConfigured] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [genNotice, setGenNotice] = useState<string | null>(null);
  // Mirrors for the auto-advance handler so it reads fresh values.
  const currentIndexRef = useRef(currentIndex);
  const episodeRef = useRef(episode);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    episodeRef.current = episode;
  });

  const generatorRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<HTMLDivElement>(null);
  const deepDiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) setSaved(loadSavedEpisodes());
    });
    isDjVoiceConfigured().then((configured) => {
      if (active) setDjConfigured(configured);
    });
    return () => {
      active = false;
    };
  }, []);

  const theme = useMemo(
    () => episode?.visualTheme ?? themes.miamiBass,
    [episode]
  );

  const currentTrack = episode?.tracks[currentIndex] ?? null;
  const isSaved = episode ? saved.some((e) => e.id === episode.id) : false;

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function showEpisode(ep: Episode) {
    setEpisode(ep);
    setPrompt(ep.prompt);
    setCurrentIndex(0);
    setRootsTrack(null);
    setDeepDiveNode(null);
    scrollTo(playerRef);
  }

  function goToTrack(index: number) {
    if (!episode) return;
    const clamped = Math.max(0, Math.min(episode.tracks.length - 1, index));
    if (clamped === currentIndex) return;
    setCurrentIndex(clamped);
  }

  function handleAdvance() {
    const ep = episodeRef.current;
    if (!ep) return;
    if (currentIndexRef.current < ep.tracks.length - 1) {
      setCurrentIndex(currentIndexRef.current + 1);
    }
  }

  async function handleGenerate(value: string) {
    const trimmed = value.trim();

    // Curated prompts (presets + Miami + empty) load instantly, no API call.
    const curated = findCuratedEpisode(trimmed);
    if (curated) {
      setGenNotice(null);
      showEpisode(generateEpisode(trimmed));
      return;
    }

    // Any other prompt tries real AI generation, then always falls back to the
    // offline engine so it never breaks.
    setGenerating(true);
    setGenNotice(null);
    try {
      const result = await generateEpisodeRemote(trimmed);
      let generated: Episode;
      if (result.status === "ok") {
        generated = result.episode;
      } else {
        if (result.status === "error") {
          setGenNotice(
            "AI generation hit a snag, so here's an offline episode themed to your prompt."
          );
        }
        generated = generateEpisode(trimmed);
      }

      // Generated episodes (AI or offline) have no verified video IDs. Resolve
      // real ones via the YouTube Data API so they embed inline and get a real
      // anonymous queue. Curated episodes returned earlier and are untouched.
      // If YOUTUBE_API_KEY is unconfigured or a track can't be found, the
      // episode is returned unchanged and keeps its "Search on YouTube"
      // fallbacks, so nothing ever breaks.
      setGenerating(false);
      setResolving(true);
      const resolved = await resolveEpisodeVideoIds(generated);
      showEpisode(resolved);
    } finally {
      setGenerating(false);
      setResolving(false);
    }
  }

  function handleSelectPreset(presetPrompt: string) {
    setPrompt(presetPrompt);
    setGenNotice(null);
    showEpisode(generateEpisode(presetPrompt));
  }

  function openQueue() {
    const url = episode?.youtubeQueueUrl ?? miamiBassEpisode.youtubeQueueUrl;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleTraceRoots(track: Track) {
    setRootsTrack(track);
    scrollTo(rootsRef);
  }

  function handleDeepDive(node: MusicConnection) {
    setDeepDiveNode(node);
    scrollTo(deepDiveRef);
  }

  function handleMakeEpisode(node: MusicConnection) {
    setPrompt(`Make me a guided radio episode about ${node.name}`);
    scrollTo(generatorRef);
  }

  function handleSaveToMap(node: MusicConnection) {
    setSavedNodeIds((prev) =>
      prev.includes(node.id) ? prev : [...prev, node.id]
    );
  }

  function handlePlayExample(node: MusicConnection) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      node.name + " music"
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleSaveEpisode() {
    if (!episode) return;
    setSaved(saveEpisode(episode));
  }

  function handleShare() {
    if (!episode) return;
    const text = `${episode.title}\n${episode.youtubeQueueUrl}`;
    navigator.clipboard
      ?.writeText(text)
      .then(() => alert("Episode link copied to clipboard."))
      .catch(() => alert(episode.youtubeQueueUrl));
  }

  function handleLoadSaved(ep: SavedEpisode) {
    setEpisode(ep);
    setPrompt(ep.prompt);
    setCurrentIndex(0);
    setRootsTrack(null);
    setDeepDiveNode(null);
    scrollTo(playerRef);
  }

  function handleDeleteSaved(id: string) {
    setSaved(deleteEpisode(id));
  }

  return (
    <main
      className={`rn-root rn-texture-${theme.texture}`}
      style={themeToStyle(theme)}
    >
      <nav className="rn-topnav">
        <span className="rn-logo rn-nav-brand">Rootnote</span>
        <Link href="/about" className="rn-btn rn-btn-ghost rn-btn-sm">
          About us
        </Link>
      </nav>

      <div className="rn-layout">
        <div className="rn-col rn-col-left">
          <div ref={generatorRef}>
            <GeneratorPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              onOpenQueue={openQueue}
              onSelectPreset={handleSelectPreset}
              generating={generating}
              resolving={resolving}
              notice={genNotice}
            />
          </div>

          {episode && (
            <EpisodeSummary
              episode={episode}
              onSave={handleSaveEpisode}
              onShare={handleShare}
              onOpenQueue={openQueue}
              isSaved={isSaved}
            />
          )}

          <SavedEpisodes
            episodes={saved}
            onLoad={handleLoadSaved}
            onDelete={handleDeleteSaved}
          />
        </div>

        <div className="rn-col rn-col-right">
          <div ref={playerRef}>
            {episode && currentTrack ? (
              <EpisodePlayer
                track={currentTrack}
                index={currentIndex}
                total={episode.tracks.length}
                djConfigured={djConfigured}
                onAdvance={handleAdvance}
                onPrev={() => goToTrack(currentIndex - 1)}
                onNext={() => goToTrack(currentIndex + 1)}
                onTraceRoots={handleTraceRoots}
              />
            ) : (
              <section className="rn-panel rn-empty-player">
                <span className="rn-section-label">No episode yet</span>
                <p>
                  Pick a preset or write your own rabbit hole, then hit{" "}
                  <strong>Generate episode</strong>. Rootnote builds a playable
                  show, adds a college radio host, and maps the roots behind
                  every track.
                </p>
              </section>
            )}
          </div>

          {episode && currentTrack && (
            <TrackQueue
              tracks={episode.tracks}
              currentIndex={currentIndex}
              onPlay={goToTrack}
              onTraceRoots={handleTraceRoots}
            />
          )}
        </div>
      </div>

      {episode && (
        <div className="rn-bottom">
          <div ref={rootsRef}>
            <RootsPanel
              track={rootsTrack}
              savedNodeIds={savedNodeIds}
              onPlayExample={handlePlayExample}
              onDeepDive={handleDeepDive}
              onMakeEpisode={handleMakeEpisode}
              onSaveToMap={handleSaveToMap}
            />
          </div>

          <div ref={deepDiveRef}>
            {deepDiveNode && (
              <DeepDivePanel
                node={deepDiveNode}
                content={getDeepDive(deepDiveNode)}
                onMakeEpisode={handleMakeEpisode}
                onPlayExamples={handlePlayExample}
                onSaveToMap={handleSaveToMap}
                onClose={() => setDeepDiveNode(null)}
              />
            )}
          </div>
        </div>
      )}

      <footer className="rn-footer">
        Rootnote · Guided listening, not just playlists. Every track is a
        doorway.
      </footer>
    </main>
  );
}

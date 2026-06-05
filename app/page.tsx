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
  generateEpisode,
  getDeepDive,
  miamiBassEpisode,
} from "@/lib/demoEpisode";
import { themes } from "@/lib/themes";
import {
  deleteEpisode,
  loadSavedEpisodes,
  saveEpisode,
} from "@/lib/storage";
import { isDjVoiceConfigured } from "@/lib/tts";
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

  function handleGenerate(value: string) {
    const ep = generateEpisode(value);
    setEpisode(ep);
    setPrompt(ep.prompt);
    setCurrentIndex(0);
    setRootsTrack(null);
    setDeepDiveNode(null);
    scrollTo(playerRef);
  }

  function handleSelectPreset(presetPrompt: string) {
    setPrompt(presetPrompt);
    handleGenerate(presetPrompt);
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
      <div className="rn-layout">
        <div className="rn-col rn-col-left">
          <div ref={generatorRef}>
            <GeneratorPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              onOpenQueue={openQueue}
              onSelectPreset={handleSelectPreset}
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
                onPrev={() =>
                  setCurrentIndex((i) => Math.max(0, i - 1))
                }
                onNext={() =>
                  setCurrentIndex((i) =>
                    Math.min(episode.tracks.length - 1, i + 1)
                  )
                }
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
              djConfigured={djConfigured}
              onPlay={setCurrentIndex}
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

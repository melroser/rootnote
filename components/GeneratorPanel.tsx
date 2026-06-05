"use client";

import { presets } from "@/lib/demoEpisode";

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: (prompt: string) => void;
  onOpenQueue: () => void;
  onSelectPreset: (prompt: string) => void;
  generating?: boolean;
  resolving?: boolean;
  notice?: string | null;
};

export default function GeneratorPanel({
  prompt,
  onPromptChange,
  onGenerate,
  onOpenQueue,
  onSelectPreset,
  generating = false,
  resolving = false,
  notice = null,
}: Props) {
  const busy = generating || resolving;
  const busyLabel = resolving
    ? "Finding tracks on YouTube…"
    : "Generating episode…";
  return (
    <section className="rn-panel rn-generator">
      <div className="rn-brand">
        <span className="rn-logo">Rootnote</span>
        <span className="rn-tagline">
          Guided radio shows that trace music back to its roots.
        </span>
      </div>

      <h1 className="rn-hero">
        Turn any music rabbit hole into a guided radio show.
      </h1>
      <p className="rn-subhero">
        Rootnote builds a playable YouTube episode, adds a college radio style
        host, and lets listeners trace the samples, sources, scenes, artists,
        and techniques behind each song.
      </p>

      <textarea
        className="rn-textarea"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Ask for a scene, artist, era, sound, sample, genre, or cultural rabbit hole."
        rows={3}
      />

      <div className="rn-generator-actions">
        <button
          type="button"
          className="rn-btn rn-btn-accent rn-btn-lg"
          onClick={() => onGenerate(prompt)}
          disabled={busy}
        >
          {busy ? busyLabel : "Generate episode"}
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-ghost"
          onClick={onOpenQueue}
        >
          Open anonymous YouTube queue
        </button>
      </div>

      {busy && (
        <div className="rn-generating" role="status">
          <span className="rn-generating-dot" />
          {resolving ? "Finding tracks on YouTube…" : "Building your episode…"}
        </div>
      )}

      {notice && !busy && <p className="rn-gen-error">{notice}</p>}

      <div className="rn-presets">
        <span className="rn-section-label">Start a rabbit hole</span>
        <div className="rn-preset-grid">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="rn-preset"
              onClick={() => onSelectPreset(preset.prompt)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

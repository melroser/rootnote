"use client";

import type { Episode } from "@/types/rootnote";

type Props = {
  episode: Episode;
  onSave: () => void;
  onShare: () => void;
  onOpenQueue: () => void;
  isSaved: boolean;
};

export default function EpisodeSummary({
  episode,
  onSave,
  onShare,
  onOpenQueue,
  isSaved,
}: Props) {
  const runtimeEstimate = `~${episode.tracks.length * 4} min`;

  return (
    <section className="rn-panel rn-summary">
      <span className="rn-section-label">Now generated</span>
      <h2 className="rn-summary-title">{episode.title}</h2>
      <span className="rn-mood-badge">
        Visual mood: {episode.visualTheme.name}
      </span>
      <p className="rn-summary-desc">{episode.description}</p>

      <dl className="rn-summary-meta">
        <div>
          <dt>Host persona</dt>
          <dd>{episode.hostPersona}</dd>
        </div>
        <div className="rn-summary-meta-row">
          <div>
            <dt>Tracks</dt>
            <dd>{episode.tracks.length}</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>{runtimeEstimate}</dd>
          </div>
        </div>
      </dl>

      <div className="rn-summary-actions">
        <button
          type="button"
          className="rn-btn rn-btn-accent"
          onClick={onSave}
        >
          {isSaved ? "Saved ✓" : "Save episode"}
        </button>
        <button type="button" className="rn-btn rn-btn-ghost" onClick={onShare}>
          Share episode
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-ghost"
          onClick={onOpenQueue}
        >
          Open anonymous YouTube queue
        </button>
      </div>
    </section>
  );
}

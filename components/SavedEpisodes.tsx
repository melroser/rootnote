"use client";

import type { SavedEpisode } from "@/types/rootnote";

type Props = {
  episodes: SavedEpisode[];
  onLoad: (episode: SavedEpisode) => void;
  onDelete: (id: string) => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function SavedEpisodes({
  episodes,
  onLoad,
  onDelete,
}: Props) {
  return (
    <section className="rn-panel rn-saved">
      <span className="rn-section-label">Saved Episodes</span>
      {episodes.length === 0 ? (
        <p className="rn-empty">
          No saved episodes yet. Generate one and hit{" "}
          <strong>Save episode</strong> to keep it here.
        </p>
      ) : (
        <ul className="rn-saved-list">
          {episodes.map((episode) => (
            <li key={episode.id} className="rn-saved-item">
              <div className="rn-saved-info">
                <h4 className="rn-saved-title">{episode.title}</h4>
                <p className="rn-saved-meta">
                  {episode.visualTheme.name} · {episode.tracks.length} tracks ·{" "}
                  {formatDate(episode.createdAt)}
                </p>
              </div>
              <div className="rn-saved-actions">
                <button
                  type="button"
                  className="rn-btn rn-btn-secondary rn-btn-sm"
                  onClick={() => onLoad(episode)}
                >
                  Load
                </button>
                <button
                  type="button"
                  className="rn-btn rn-btn-ghost rn-btn-sm"
                  onClick={() => onDelete(episode.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import Image from "next/image";
import type { Track } from "@/types/rootnote";

type Props = {
  tracks: Track[];
  currentIndex: number;
  onPlay: (index: number) => void;
  onTraceRoots: (track: Track) => void;
};

export default function TrackQueue({
  tracks,
  currentIndex,
  onPlay,
  onTraceRoots,
}: Props) {
  return (
    <section className="rn-panel rn-queue">
      <span className="rn-section-label">Episode queue</span>
      <div className="rn-queue-list">
        {tracks.map((track, index) => (
          <article
            key={`${track.videoId}-${index}`}
            className={`rn-track-card ${index === currentIndex ? "is-current" : ""}`}
          >
            <button
              type="button"
              className="rn-thumb-btn"
              onClick={() => onPlay(index)}
              aria-label={`Play ${track.title}`}
            >
              {track.thumbnailUrl ? (
                <Image
                  className="rn-thumb"
                  src={track.thumbnailUrl}
                  alt={`${track.artist} — ${track.title}`}
                  width={160}
                  height={90}
                  unoptimized
                />
              ) : (
                <span className="rn-thumb rn-thumb-placeholder" aria-hidden="true">
                  ♪
                </span>
              )}
              <span className="rn-thumb-index">{index + 1}</span>
            </button>

            <div className="rn-track-body">
              <h3 className="rn-track-card-title">{track.title}</h3>
              <p className="rn-track-card-artist">{track.artist}</p>
              <p className="rn-track-note">{track.listeningNote}</p>
              <p className="rn-track-preview">“{track.hostScript}”</p>

              <div className="rn-track-actions">
                <button
                  type="button"
                  className="rn-btn rn-btn-accent rn-btn-sm"
                  onClick={() => onPlay(index)}
                >
                  Play
                </button>
                <button
                  type="button"
                  className="rn-btn rn-btn-secondary rn-btn-sm"
                  onClick={() => onTraceRoots(track)}
                >
                  Trace roots
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

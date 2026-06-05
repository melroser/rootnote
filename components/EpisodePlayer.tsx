"use client";

import type { Track } from "@/types/rootnote";
import { embedUrl } from "@/lib/youtube";
import DjVoiceButton from "@/components/DjVoiceButton";

type Props = {
  track: Track;
  index: number;
  total: number;
  djConfigured: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTraceRoots: (track: Track) => void;
};

export default function EpisodePlayer({
  track,
  index,
  total,
  djConfigured,
  onPrev,
  onNext,
  onTraceRoots,
}: Props) {
  return (
    <section className="rn-panel rn-player">
      <div className="rn-player-frame">
        <iframe
          key={track.videoId}
          className="rn-iframe"
          src={embedUrl(track.videoId)}
          title={`${track.artist} — ${track.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="rn-now-playing">
        <span className="rn-section-label">
          Now playing · Track {index + 1} of {total}
        </span>
        <h2 className="rn-track-title">{track.title}</h2>
        <p className="rn-track-artist">{track.artist}</p>
      </div>

      <div className="rn-visualizer" aria-hidden="true">
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
        <DjVoiceButton text={track.hostScript} configured={djConfigured} />
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

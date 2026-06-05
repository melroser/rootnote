"use client";

import type { DeepDiveContent, MusicConnection } from "@/types/rootnote";

type Props = {
  node: MusicConnection;
  content: DeepDiveContent;
  onMakeEpisode: (node: MusicConnection) => void;
  onPlayExamples: (node: MusicConnection) => void;
  onSaveToMap: (node: MusicConnection) => void;
  onClose: () => void;
};

export default function DeepDivePanel({
  node,
  content,
  onMakeEpisode,
  onPlayExamples,
  onSaveToMap,
  onClose,
}: Props) {
  return (
    <section className="rn-panel rn-deepdive">
      <div className="rn-deepdive-head">
        <span className="rn-section-label">Deep dive</span>
        <button
          type="button"
          className="rn-btn rn-btn-ghost rn-btn-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <h3 className="rn-deepdive-title">{content.title}</h3>

      <div className="rn-deepdive-block">
        <span className="rn-section-label rn-sub">Summary</span>
        <p>{content.summary}</p>
      </div>
      <div className="rn-deepdive-block">
        <span className="rn-section-label rn-sub">Why this matters</span>
        <p>{content.whyThisMatters}</p>
      </div>
      <div className="rn-deepdive-block">
        <span className="rn-section-label rn-sub">Artist and scene context</span>
        <p>{content.context}</p>
      </div>

      <div className="rn-deepdive-actions">
        <button
          type="button"
          className="rn-btn rn-btn-accent"
          onClick={() => onMakeEpisode(node)}
        >
          Make episode from here
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-ghost"
          onClick={() => onPlayExamples(node)}
        >
          Play examples
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-ghost"
          onClick={() => onSaveToMap(node)}
        >
          Save to my map
        </button>
      </div>
    </section>
  );
}

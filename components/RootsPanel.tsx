"use client";

import type { MusicConnection, Track } from "@/types/rootnote";

type Props = {
  track: Track | null;
  savedNodeIds: string[];
  onPlayExample: (node: MusicConnection) => void;
  onDeepDive: (node: MusicConnection) => void;
  onMakeEpisode: (node: MusicConnection) => void;
  onSaveToMap: (node: MusicConnection) => void;
};

const TYPE_LABELS: Record<MusicConnection["type"], string> = {
  sampled: "Sampled",
  influenced_by: "Influenced by",
  same_scene: "Same scene",
  uses_technique: "Uses technique",
  branches_into: "Branches into",
};

const CONFIDENCE_LABELS: Record<MusicConnection["confidence"], string> = {
  confirmed: "Confirmed",
  likely: "Likely",
  scene_connection: "Scene connection",
  ai_inferred: "AI inferred",
};

function NodeCard({
  node,
  saved,
  onPlayExample,
  onDeepDive,
  onMakeEpisode,
  onSaveToMap,
}: {
  node: MusicConnection;
  saved: boolean;
} & Pick<
  Props,
  "onPlayExample" | "onDeepDive" | "onMakeEpisode" | "onSaveToMap"
>) {
  return (
    <article className="rn-node">
      <div className="rn-node-head">
        <h4 className="rn-node-name">{node.name}</h4>
        <div className="rn-badges">
          <span className="rn-badge rn-badge-type">
            {TYPE_LABELS[node.type]}
          </span>
          <span className={`rn-badge rn-badge-conf rn-conf-${node.confidence}`}>
            {CONFIDENCE_LABELS[node.confidence]}
          </span>
        </div>
      </div>
      <p className="rn-node-explain">{node.explanation}</p>
      <div className="rn-node-actions">
        <button
          type="button"
          className="rn-btn rn-btn-ghost rn-btn-sm"
          onClick={() => onPlayExample(node)}
        >
          Play example
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-secondary rn-btn-sm"
          onClick={() => onDeepDive(node)}
        >
          Dive deeper
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-accent rn-btn-sm"
          onClick={() => onMakeEpisode(node)}
        >
          Make episode from here
        </button>
        <button
          type="button"
          className="rn-btn rn-btn-ghost rn-btn-sm"
          onClick={() => onSaveToMap(node)}
        >
          {saved ? "Saved to map ✓" : "Save to my map"}
        </button>
      </div>
    </article>
  );
}

export default function RootsPanel({
  track,
  savedNodeIds,
  onPlayExample,
  onDeepDive,
  onMakeEpisode,
  onSaveToMap,
}: Props) {
  if (!track) {
    return (
      <section className="rn-panel rn-roots">
        <span className="rn-section-label">Roots and Branches</span>
        <p className="rn-empty">
          Click <strong>Trace roots</strong> on any track to follow the sound
          back to its sources and forward into the scenes it shaped.
        </p>
      </section>
    );
  }

  return (
    <section className="rn-panel rn-roots">
      <span className="rn-section-label">Roots and Branches</span>
      <h3 className="rn-roots-track">
        {track.artist} <span className="rn-divider">|</span> {track.title}
      </h3>
      {track.artistContext && (
        <p className="rn-roots-context">{track.artistContext}</p>
      )}

      <div className="rn-roots-columns">
        <div>
          <span className="rn-section-label rn-sub">Roots</span>
          {track.roots.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              saved={savedNodeIds.includes(node.id)}
              onPlayExample={onPlayExample}
              onDeepDive={onDeepDive}
              onMakeEpisode={onMakeEpisode}
              onSaveToMap={onSaveToMap}
            />
          ))}
        </div>
        <div>
          <span className="rn-section-label rn-sub">Branches</span>
          {track.branches.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              saved={savedNodeIds.includes(node.id)}
              onPlayExample={onPlayExample}
              onDeepDive={onDeepDive}
              onMakeEpisode={onMakeEpisode}
              onSaveToMap={onSaveToMap}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

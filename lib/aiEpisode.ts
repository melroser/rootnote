import type {
  Confidence,
  ConnectionType,
  Episode,
  MusicConnection,
  Track,
} from "@/types/rootnote";
import { getThemeForPrompt } from "@/lib/themes";
import { makeYouTubeSearchQueueUrl } from "@/lib/youtube";
import { searchTrack } from "@/lib/episodes/helpers";

export type AiConnection = {
  name?: string;
  type?: string;
  confidence?: string;
  explanation?: string;
};

export type AiTrack = {
  artist?: string;
  title?: string;
  listeningNote?: string;
  hostScript?: string;
  artistContext?: string;
  roots?: AiConnection[];
  branches?: AiConnection[];
};

export type AiDraft = {
  title?: string;
  description?: string;
  hostPersona?: string;
  theme?: string;
  tracks?: AiTrack[];
};

const CONNECTION_TYPES: ConnectionType[] = [
  "sampled",
  "influenced_by",
  "same_scene",
  "uses_technique",
  "branches_into",
];

const CONFIDENCES: Confidence[] = [
  "confirmed",
  "likely",
  "scene_connection",
  "ai_inferred",
];

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "node"
  );
}

function coerceType(value: string | undefined): ConnectionType {
  const v = (value ?? "").toLowerCase().replace(/\s+/g, "_");
  return (CONNECTION_TYPES as string[]).includes(v)
    ? (v as ConnectionType)
    : "influenced_by";
}

function coerceConfidence(value: string | undefined): Confidence {
  const v = (value ?? "").toLowerCase().replace(/\s+/g, "_");
  // The LLM should not claim certainty it cannot have, so anything unexpected
  // defaults to ai_inferred.
  return (CONFIDENCES as string[]).includes(v)
    ? (v as Confidence)
    : "ai_inferred";
}

function coerceConnections(
  list: AiConnection[] | undefined,
  prefix: string
): MusicConnection[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((c) => c && (c.name || c.explanation))
    .slice(0, 6)
    .map((c, i) => ({
      id: `${prefix}-${slugify(c.name ?? String(i))}-${i}`,
      name: (c.name ?? "Connection").trim(),
      type: coerceType(c.type),
      confidence: coerceConfidence(c.confidence),
      explanation:
        (c.explanation ?? "").trim() ||
        "An AI-suggested connection. Treat it as a starting point to verify, not a confirmed fact.",
    }));
}

/**
 * Convert a loosely-typed LLM draft into a fully valid Episode. The LLM is
 * never trusted for YouTube video IDs, so every track plays via search.
 */
export function buildAiEpisode(draft: AiDraft, prompt: string): Episode {
  const trimmed = prompt.trim();
  const rawTracks = Array.isArray(draft.tracks) ? draft.tracks : [];

  const tracks: Track[] = rawTracks
    .filter((t) => t && t.artist && t.title)
    .slice(0, 8)
    .map((t, i) =>
      searchTrack({
        position: i + 1,
        artist: (t.artist ?? "").trim(),
        title: (t.title ?? "").trim(),
        listeningNote:
          (t.listeningNote ?? "").trim() || "An AI-selected pick for this theme.",
        hostScript:
          (t.hostScript ?? "").trim() ||
          `${t.artist}, ${t.title}. Let it play and listen for how it fits the thread we're chasing tonight.`,
        artistContext: t.artistContext?.trim() || undefined,
        roots: coerceConnections(t.roots, `r${i}`),
        branches: coerceConnections(t.branches, `b${i}`),
      })
    );

  const title = (draft.title ?? "").trim() || "A Rootnote Episode";
  const themeHint = `${draft.theme ?? ""} ${trimmed}`;

  return {
    id: `episode-${Date.now()}`,
    slug: slugify(title),
    title,
    description:
      (draft.description ?? "").trim() ||
      "An AI-generated guided listening session. Tracks play via YouTube search since exact uploads are not verified.",
    prompt: trimmed,
    hostPersona:
      (draft.hostPersona ?? "").trim() ||
      "Late night college radio DJ. Smart but not academic. Specific, warm, and slightly conspiratorial.",
    visualTheme: getThemeForPrompt(themeHint),
    tracks,
    youtubeQueueUrl: makeYouTubeSearchQueueUrl(
      tracks.map((t) => t.searchQuery ?? `${t.artist} ${t.title}`)
    ),
    createdAt: new Date().toISOString(),
  };
}

export function isUsableDraft(draft: AiDraft | null | undefined): boolean {
  return Boolean(
    draft &&
      Array.isArray(draft.tracks) &&
      draft.tracks.filter((t) => t && t.artist && t.title).length >= 3
  );
}

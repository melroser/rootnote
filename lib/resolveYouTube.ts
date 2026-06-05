import type { Episode, Track } from "@/types/rootnote";
import { makeYouTubeQueueUrl, thumbnailUrl, watchUrl } from "@/lib/youtube";

// search.list costs 100 quota units per call, so we resolve at most a few
// tracks at a time and bail out as soon as the key reports unconfigured.
const CONCURRENCY = 3;

type SearchResponse = {
  configured?: boolean;
  videoId?: string | null;
  title?: string | null;
  channelTitle?: string | null;
  thumbnailUrl?: string | null;
  error?: string;
};

type Resolved = {
  videoId: string;
  thumbnailUrl: string;
};

type ResolveOutcome =
  | { ok: true; data: Resolved }
  | { ok: false; unconfigured: boolean };

/**
 * Status check that mirrors isDjVoiceConfigured: lets the client decide whether
 * to even attempt resolution, without exposing the key.
 */
export async function isYouTubeResolverConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/youtube/search", { method: "GET" });
    if (!res.ok) return false;
    const data = (await res.json()) as { configured?: boolean };
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

async function resolveOne(query: string): Promise<ResolveOutcome> {
  try {
    const res = await fetch("/api/youtube/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = (await res.json().catch(() => null)) as SearchResponse | null;
    if (!data) return { ok: false, unconfigured: false };
    if (data.configured === false) return { ok: false, unconfigured: true };
    if (res.ok && data.videoId) {
      return {
        ok: true,
        data: {
          videoId: data.videoId,
          thumbnailUrl: data.thumbnailUrl || thumbnailUrl(data.videoId),
        },
      };
    }
    // No result, error status, or null id: keep the search fallback.
    return { ok: false, unconfigured: false };
  } catch {
    return { ok: false, unconfigured: false };
  }
}

function needsResolution(track: Track): boolean {
  return track.playback !== "id" || !track.videoId;
}

/**
 * Resolve real YouTube video IDs for a GENERATED episode (AI or offline). Each
 * unresolved track is searched concurrently (capped) and politely; partial
 * failures keep their "Search on YouTube" fallback. Curated episodes already
 * have verified IDs and should never be passed here.
 *
 * Returns a new Episode with resolved tracks promoted to inline embeds and an
 * anonymous watch_videos queue built from whatever resolved. If nothing
 * resolves (e.g. key unconfigured), the original episode is returned unchanged
 * so the existing fallbacks stay intact.
 */
export async function resolveEpisodeVideoIds(
  episode: Episode
): Promise<Episode> {
  const targets = episode.tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => needsResolution(track));

  if (targets.length === 0) return episode;

  const resolved = new Map<number, Resolved>();
  let unconfigured = false;
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < targets.length) {
      if (unconfigured) return;
      const { track, index } = targets[cursor++];
      const query = `${track.artist} ${track.title} official`;
      const outcome = await resolveOne(query);
      if (outcome.ok) {
        resolved.set(index, outcome.data);
      } else if (outcome.unconfigured) {
        unconfigured = true;
        return;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, targets.length) }, worker)
  );

  if (resolved.size === 0) return episode;

  const tracks: Track[] = episode.tracks.map((track, index) => {
    const hit = resolved.get(index);
    if (!hit) return track;
    return {
      ...track,
      videoId: hit.videoId,
      playback: "id",
      youtubeUrl: watchUrl(hit.videoId),
      thumbnailUrl: hit.thumbnailUrl,
    };
  });

  const resolvedIds = tracks
    .filter((track) => track.playback === "id" && track.videoId)
    .map((track) => track.videoId);

  return {
    ...episode,
    tracks,
    // Build the anonymous queue from the IDs that resolved. If none did we keep
    // the original (YouTube search) queue URL as a graceful fallback.
    youtubeQueueUrl:
      resolvedIds.length > 0
        ? makeYouTubeQueueUrl(resolvedIds)
        : episode.youtubeQueueUrl,
  };
}

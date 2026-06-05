import type { Track } from "@/types/rootnote";
import {
  searchResultsUrl,
  thumbnailUrl,
  watchUrl,
} from "@/lib/youtube";

/**
 * Curated track helper: derives the watch + thumbnail URLs from a verified
 * YouTube videoId. Used by every hand-authored episode so the embed behavior
 * stays identical to the original Miami Bass show.
 */
export function track(
  partial: Omit<Track, "youtubeUrl" | "thumbnailUrl">
): Track {
  return {
    ...partial,
    playback: partial.playback ?? "id",
    youtubeUrl: watchUrl(partial.videoId),
    thumbnailUrl: thumbnailUrl(partial.videoId),
  };
}

/**
 * AI / offline track helper: no trusted videoId, so playback falls back to a
 * YouTube search and there is no real thumbnail (the UI renders a placeholder).
 */
export function searchTrack(
  partial: Omit<
    Track,
    "videoId" | "youtubeUrl" | "thumbnailUrl" | "playback" | "searchQuery"
  > & { searchQuery?: string }
): Track {
  const query = partial.searchQuery ?? `${partial.artist} ${partial.title}`;
  return {
    ...partial,
    videoId: "",
    playback: "search",
    searchQuery: query,
    youtubeUrl: searchResultsUrl(query),
    thumbnailUrl: "",
  };
}

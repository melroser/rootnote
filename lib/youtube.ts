export function makeYouTubeQueueUrl(videoIds: string[]): string {
  const ids = videoIds
    .map((id) => id.trim())
    .filter(Boolean)
    .join(",");
  return `https://www.youtube.com/watch_videos?video_ids=${ids}`;
}

export function embedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function thumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// Deprecated by YouTube (listType=search returns 4xx since 2020-11-15), so this
// is kept only as a best-effort attempt; the player also surfaces a plain
// "Search on YouTube" link as the real fallback.
export function searchEmbedUrl(query: string): string {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    query
  )}`;
}

export function searchResultsUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}`;
}

// For AI episodes we have no verified IDs, so the "open queue" button points at
// a search for the whole show rather than the anonymous watch_videos queue.
export function makeYouTubeSearchQueueUrl(queries: string[]): string {
  const joined = queries.filter(Boolean).join(" ");
  return searchResultsUrl(joined.slice(0, 200));
}

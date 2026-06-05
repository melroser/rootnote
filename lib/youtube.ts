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

export const runtime = "nodejs";

type SearchRequest = {
  query?: string;
};

const PLACEHOLDERS = new Set(["your_key_here", ""]);

function realValue(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return PLACEHOLDERS.has(trimmed) ? null : trimmed;
}

function apiKey(): string | null {
  return realValue(process.env.YOUTUBE_API_KEY);
}

// GET mirrors the TTS/generate routes: lets the client check whether real
// YouTube ID resolution is available WITHOUT ever exposing the key.
export async function GET() {
  return Response.json({ configured: apiKey() !== null });
}

type YouTubeSearchResponse = {
  items?: {
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }[];
};

export async function POST(req: Request) {
  let query = "";
  try {
    const body = (await req.json()) as SearchRequest;
    query = (body.query ?? "").trim();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!query) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const key = apiKey();
  // Unconfigured: signal the client to keep its "Search on YouTube" fallback.
  // Mirrors /api/generate (status 200 + { configured: false }); never throws.
  if (!key) {
    return Response.json({ configured: false });
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("q", query);
  url.searchParams.set("key", key);

  let res: Response;
  try {
    res = await fetch(url);
  } catch (error) {
    return Response.json(
      {
        configured: true,
        error: "YouTube request failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    return Response.json(
      { configured: true, error: "YouTube search failed", details: details.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = (await res.json()) as YouTubeSearchResponse;
  const item = data.items?.[0];
  const videoId = item?.id?.videoId;
  if (!videoId) {
    // No match: client keeps the search fallback for this track.
    return Response.json(
      { configured: true, videoId: null, error: "No video found" },
      { status: 404 }
    );
  }

  const thumbs = item?.snippet?.thumbnails;
  return Response.json({
    configured: true,
    videoId,
    title: item?.snippet?.title ?? "",
    channelTitle: item?.snippet?.channelTitle ?? "",
    thumbnailUrl: thumbs?.high?.url ?? thumbs?.medium?.url ?? thumbs?.default?.url ?? "",
  });
}

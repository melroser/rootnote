// Dev-only helper: resolve "artist title" queries to verified, embeddable
// YouTube video IDs. For each query it extracts the top unique IDs from the
// search results page, then confirms each via the public oEmbed endpoint
// (which only succeeds for existing, embeddable videos) and prints the title
// + channel so a human can confirm it is the right upload.
// Usage: node scripts/resolve-yt.mjs "Artist One - Title" "Artist Two - Title"

const queries = process.argv.slice(2);

async function topIds(query, limit = 6) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  const html = await res.text();
  const ids = [];
  const re = /"videoId":"([A-Za-z0-9_-]{11})"/g;
  let m;
  while ((m = re.exec(html)) && ids.length < 200) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  return ids.slice(0, limit);
}

async function oembed(id) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title, author: data.author_name };
  } catch {
    return null;
  }
}

for (const q of queries) {
  console.log(`\n### ${q}`);
  const ids = await topIds(q);
  for (const id of ids) {
    const meta = await oembed(id);
    if (meta) {
      console.log(`${id}  ::  ${meta.title}  ::  ${meta.author}`);
    } else {
      console.log(`${id}  ::  (not embeddable / unavailable)`);
    }
  }
}

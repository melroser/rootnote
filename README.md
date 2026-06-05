# Rootnote

Rootnote turns music rabbit holes into guided radio episodes.

It takes a prompt like _"Introduce me to Miami bass like a late night college
radio DJ"_ and builds a playable YouTube listening episode with a college-radio
host, an anonymous YouTube queue link, adaptive visual theming, and a
**Trace roots** feature that maps the samples, influences, scenes, artists, and
techniques behind each track.

Guided listening, not just playlists. Every track is a doorway.

## Run it

```bash
npm run dev
```

Then open http://localhost:3000

## Demo flow (Miami Bass 101)

1. Click the **Miami Bass 101** preset
2. The episode generates with the "Neon Trunk Rattle" theme
3. Play the embedded YouTube track
4. Click **Play DJ voice** to hear the host commentary (needs ElevenLabs keys)
5. Click **Trace roots** on M.C. A.D.E. — Bass Rock Express
6. Explore the roots/branches tree (808, electro funk, Kraftwerk, 2 Live Crew…)
7. Click **Dive deeper** on Roland TR 808
8. Click **Make episode from here** (seeds a new prompt)
9. Click **Open anonymous YouTube queue**

## DJ voice (ElevenLabs) — optional

The app runs fully without ElevenLabs. The **Play DJ voice** buttons stay
disabled with an "Add ElevenLabs keys to enable DJ voice" message until keys
are configured.

To enable it, copy `.env.example` to `.env.local` and fill in:

```
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

Create the API key scoped to **Text to Speech = Access**, everything else
**No Access**. Restart `npm run dev` after editing `.env.local`. The key is only
ever used server-side in `app/api/tts/route.ts` and never exposed to the client.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Mocked episode data (`lib/demoEpisode.ts`) — feels real, no backend
- YouTube embeds + anonymous `watch_videos` queue links
- localStorage for saved episodes
- Adaptive per-episode visual themes via CSS variables
- ElevenLabs TTS through a server route (optional)

No authentication, no database, no real LLM generation — those are stretch
goals. This is the polished MVP.

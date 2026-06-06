export async function isDjVoiceConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/tts", { method: "GET" });
    if (!res.ok) return false;
    const data = (await res.json()) as { configured?: boolean };
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

// Only one DJ segment at a time across radio mode + manual buttons.
let activeDjAudio: HTMLAudioElement | null = null;

export function stopActiveDjVoice() {
  if (!activeDjAudio) return;
  activeDjAudio.onended = null;
  try {
    activeDjAudio.pause();
  } catch {
    /* ignore */
  }
  activeDjAudio = null;
}

export function registerActiveDjAudio(audio: HTMLAudioElement | null) {
  activeDjAudio = audio;
}

// Cache resolved DJ audio per script so replays / radio loops don't re-spend
// ElevenLabs credits. Keyed by the exact text; value is a blob object URL.
const djVoiceCache = new Map<string, string>();

// Fetch (or reuse) the DJ voice audio for a script and return a playable URL.
// Throws with a human-readable message on failure (e.g. quota exceeded) so
// callers can surface the real reason.
export async function fetchDjVoiceUrl(text: string): Promise<string> {
  const cached = djVoiceCache.get(text);
  if (cached) return cached;

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const error = (await res.json().catch(() => null)) as
      | { error?: string; details?: string }
      | null;
    let message = error?.error ?? "DJ voice failed";
    if (error?.details && /quota/i.test(error.details)) {
      message = "Out of ElevenLabs credits";
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const audioUrl = URL.createObjectURL(blob);
  djVoiceCache.set(text, audioUrl);
  return audioUrl;
}

const DJ_GAIN = 2.25;

// Create (but do not auto-play) an audio element for a DJ script. Boosts
// loudness via Web Audio when available — ElevenLabs output is often quiet.
export async function createDjVoice(text: string): Promise<HTMLAudioElement> {
  const audioUrl = await fetchDjVoiceUrl(text);
  const audio = new Audio(audioUrl);
  audio.volume = 1;

  try {
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      gain.gain.value = DJ_GAIN;
      source.connect(gain);
      gain.connect(ctx.destination);
      (audio as HTMLAudioElement & { _boostCtx?: AudioContext })._boostCtx = ctx;
      await ctx.resume();
    }
  } catch {
    // Plain <audio> at max volume if Web Audio can't attach.
  }

  return audio;
}

export async function playDjVoice(text: string): Promise<HTMLAudioElement> {
  stopActiveDjVoice();
  const audio = await createDjVoice(text);
  registerActiveDjAudio(audio);
  const priorOnended = audio.onended;
  audio.onended = (ev) => {
    if (activeDjAudio === audio) activeDjAudio = null;
    priorOnended?.call(audio, ev);
  };
  await audio.play();
  return audio;
}

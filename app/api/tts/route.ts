export const runtime = "nodejs";

type TtsRequest = {
  text?: string;
};

const PLACEHOLDERS = new Set(["your_key_here", "your_voice_id_here", ""]);

function realValue(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return PLACEHOLDERS.has(trimmed) ? null : trimmed;
}

function credentials(): { apiKey: string; voiceId: string } | null {
  const apiKey = realValue(process.env.ELEVENLABS_API_KEY);
  const voiceId = realValue(process.env.ELEVENLABS_VOICE_ID);
  if (!apiKey || !voiceId) return null;
  return { apiKey, voiceId };
}

export async function GET() {
  return Response.json({ configured: credentials() !== null });
}

export async function POST(req: Request) {
  try {
    const { text } = (await req.json()) as TtsRequest;
    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }
    if (text.length > 1200) {
      return Response.json(
        { error: "Text is too long for a quick demo segment" },
        { status: 400 }
      );
    }
    const creds = credentials();
    if (!creds) {
      return Response.json(
        { error: "Missing ElevenLabs environment variables" },
        { status: 500 }
      );
    }
    const { apiKey, voiceId } = creds;
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      }
    );
    if (!elevenRes.ok) {
      const errorText = await elevenRes.text();
      return Response.json(
        { error: "ElevenLabs request failed", details: errorText },
        { status: elevenRes.status }
      );
    }
    const audio = await elevenRes.arrayBuffer();
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "TTS route failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

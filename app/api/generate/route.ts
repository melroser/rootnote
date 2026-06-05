import { buildAiEpisode, isUsableDraft, type AiDraft } from "@/lib/aiEpisode";

export const runtime = "nodejs";

type GenerateRequest = {
  prompt?: string;
};

const PLACEHOLDERS = new Set(["your_key_here", ""]);

function realValue(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return PLACEHOLDERS.has(trimmed) ? null : trimmed;
}

function apiKey(): string | null {
  return realValue(process.env.OPENAI_API_KEY);
}

// GET mirrors the TTS route: lets the client know whether real generation is on.
export async function GET() {
  return Response.json({ configured: apiKey() !== null });
}

const SYSTEM_PROMPT = `You are the music director for "Rootnote", an app that turns any prompt into a guided, late-night college-radio episode.
Voice for hostScript: smart, specific, warm, slightly conspiratorial. NOT influencer hype. Like someone who loves music history but still wants the record to hit.
Return ONLY JSON matching this shape:
{
  "title": string,
  "description": string,
  "hostPersona": string,
  "theme": string, // ONE keyword from: miami bass, metal, country, r&b, punk, ambient, hip hop, disco, electronic
  "tracks": [ // 6 to 8 real, well-known songs that truly exist
    {
      "artist": string,
      "title": string,
      "listeningNote": string, // one sentence, what to listen for
      "hostScript": string, // 2-4 sentences in the host voice
      "artistContext": string, // optional, one sentence
      "roots": [ { "name": string, "type": ConnType, "confidence": Conf, "explanation": string } ],
      "branches": [ { "name": string, "type": ConnType, "confidence": Conf, "explanation": string } ]
    }
  ]
}
ConnType is one of: sampled, influenced_by, same_scene, uses_technique, branches_into.
Conf is one of: confirmed, likely, scene_connection, ai_inferred. Use "confirmed" only for facts you are certain of; otherwise prefer "likely" or "ai_inferred".
Give rich roots AND branches (3-5 each) for the first 1-2 anchor tracks, and at least 1-2 each for the rest.
Do NOT include YouTube links, video ids, urls, or images. Only real songs.`;

async function callOpenAi(prompt: string, key: string): Promise<AiDraft | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Build a Rootnote episode for this prompt:\n"""${prompt}"""`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  try {
    return JSON.parse(content) as AiDraft;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let prompt = "";
  try {
    const body = (await req.json()) as GenerateRequest;
    prompt = (body.prompt ?? "").trim();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!prompt) {
    return Response.json({ error: "Missing prompt" }, { status: 400 });
  }
  if (prompt.length > 2000) {
    return Response.json({ error: "Prompt is too long" }, { status: 400 });
  }

  const key = apiKey();
  // Unconfigured: signal the client to use its offline engine. Never throw.
  if (!key) {
    return Response.json({ configured: false });
  }

  try {
    const draft = await callOpenAi(prompt, key);
    if (!isUsableDraft(draft)) {
      // Configured but the model returned something unusable: let the client
      // fall back gracefully rather than showing a broken episode.
      return Response.json(
        { configured: true, error: "Model returned an unusable episode" },
        { status: 502 }
      );
    }
    const episode = buildAiEpisode(draft as AiDraft, prompt);
    return Response.json({ configured: true, episode });
  } catch (error) {
    return Response.json(
      {
        configured: true,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 502 }
    );
  }
}

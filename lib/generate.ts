import type { Episode } from "@/types/rootnote";

export type RemoteGenerateResult =
  | { status: "ok"; episode: Episode }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

/**
 * Calls the server generate route. Returns a discriminated result so the caller
 * can fall back to the offline engine on "unconfigured" or "error" without ever
 * breaking the UI.
 */
export async function generateEpisodeRemote(
  prompt: string
): Promise<RemoteGenerateResult> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = (await res.json().catch(() => null)) as
      | { configured?: boolean; episode?: Episode; error?: string }
      | null;

    if (!data) return { status: "error", message: "Empty response" };
    if (data.configured === false) return { status: "unconfigured" };
    if (res.ok && data.episode) {
      return { status: "ok", episode: data.episode };
    }
    return { status: "error", message: data.error ?? "Generation failed" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

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

export async function playDjVoice(text: string): Promise<HTMLAudioElement> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    console.error("TTS failed", error);
    throw new Error(error?.error ?? "DJ voice failed");
  }
  const blob = await res.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.onended = () => URL.revokeObjectURL(audioUrl);
  await audio.play();
  return audio;
}

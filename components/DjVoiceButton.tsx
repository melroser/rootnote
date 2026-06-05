"use client";

import { useRef, useState } from "react";
import { playDjVoice } from "@/lib/tts";

type Props = {
  text: string;
  configured: boolean;
  compact?: boolean;
  className?: string;
};

export default function DjVoiceButton({
  text,
  configured,
  compact = false,
  className = "",
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!configured) {
    return (
      <button
        type="button"
        disabled
        title="Add ElevenLabs keys to enable DJ voice"
        className={`rn-btn rn-btn-disabled ${className}`}
      >
        {compact ? "DJ voice off" : "Add ElevenLabs keys to enable DJ voice"}
      </button>
    );
  }

  async function handleClick() {
    if (state === "loading") return;
    setState("loading");
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = await playDjVoice(text);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const label =
    state === "loading"
      ? "Generating DJ voice…"
      : state === "error"
        ? "DJ voice failed — retry"
        : "Play DJ voice";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className={`rn-btn rn-btn-accent ${state === "error" ? "rn-btn-error" : ""} ${className}`}
    >
      {compact && state === "idle" ? "DJ voice" : label}
    </button>
  );
}

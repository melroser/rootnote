import type { EpisodeVisualTheme } from "@/types/rootnote";

export const themes: Record<string, EpisodeVisualTheme> = {
  miamiBass: {
    name: "Neon Trunk Rattle",
    mood: "hot, bass heavy, chrome, nightclub, car audio",
    background: "#0a0410",
    panel: "#1a0a24",
    accent: "#ff2d8e",
    secondaryAccent: "#22e0e8",
    text: "#fdf3f7",
    mutedText: "#b89cc7",
    texture: "neon",
  },
  metal: {
    name: "Blackened Steel",
    mood: "heavy, aggressive, scorched, high contrast",
    background: "#070707",
    panel: "#161616",
    accent: "#c41212",
    secondaryAccent: "#8a939c",
    text: "#ffffff",
    mutedText: "#9aa0a6",
    texture: "metal",
  },
  country: {
    name: "Dust and Neon",
    mood: "warm, dusty, roadside, leather, old wood",
    background: "#1e1208",
    panel: "#3a2412",
    accent: "#e8a13a",
    secondaryAccent: "#5fb6ad",
    text: "#f6ecd8",
    mutedText: "#c2a787",
    texture: "western",
  },
  rnb: {
    name: "Velvet Room",
    mood: "smooth, intimate, mellow, purple, warm lights",
    background: "#1a0b22",
    panel: "#2c1340",
    accent: "#c9a4ff",
    secondaryAccent: "#e8b48c",
    text: "#faf2ff",
    mutedText: "#bca6cf",
    texture: "velvet",
  },
  punk: {
    name: "Photocopied Zine",
    mood: "raw, handmade, political, torn paper, black ink",
    background: "#0c0c0c",
    panel: "#1d1d1d",
    accent: "#ff2d8e",
    secondaryAccent: "#f2e635",
    text: "#f5f5f0",
    mutedText: "#a3a39c",
    texture: "zine",
  },
  ambient: {
    name: "Blue Drift",
    mood: "slow, spacious, underwater, meditative",
    background: "#06101f",
    panel: "#0d1c33",
    accent: "#9fd4ff",
    secondaryAccent: "#86e6b8",
    text: "#eaf4ff",
    mutedText: "#8fa6c0",
    texture: "none",
  },
  hiphop: {
    name: "Streetlight Gold",
    mood: "city night, concrete, gold, block party",
    background: "#0a0a0a",
    panel: "#1c1c1c",
    accent: "#e8c249",
    secondaryAccent: "#3d8bff",
    text: "#fbf7e9",
    mutedText: "#a39d8a",
    texture: "vinyl",
  },
  disco: {
    name: "Mirrorball",
    mood: "warm, shiny, dance floor, glamorous",
    background: "#1a0a26",
    panel: "#26103a",
    accent: "#f2c64b",
    secondaryAccent: "#ff7ac0",
    text: "#fdf3ff",
    mutedText: "#c1a6d4",
    texture: "vinyl",
  },
  electronic: {
    name: "Signal Path",
    mood: "synthetic, futuristic, weird, glowing",
    background: "#070710",
    panel: "#13132a",
    accent: "#28e0e0",
    secondaryAccent: "#e054d6",
    text: "#eef0ff",
    mutedText: "#9aa0c4",
    texture: "static",
  },
};

export function getThemeForPrompt(prompt: string): EpisodeVisualTheme {
  const lower = prompt.toLowerCase();
  if (
    lower.includes("metal") ||
    lower.includes("doom") ||
    lower.includes("black metal")
  ) {
    return themes.metal;
  }
  if (
    lower.includes("country") ||
    lower.includes("western") ||
    lower.includes("americana")
  ) {
    return themes.country;
  }
  if (
    lower.includes("r&b") ||
    lower.includes("rnb") ||
    lower.includes("soul")
  ) {
    return themes.rnb;
  }
  if (
    lower.includes("punk") ||
    lower.includes("riot grrrl") ||
    lower.includes("post punk")
  ) {
    return themes.punk;
  }
  if (
    lower.includes("ambient") ||
    lower.includes("meditation") ||
    lower.includes("drone")
  ) {
    return themes.ambient;
  }
  if (lower.includes("hip hop") || lower.includes("rap")) {
    return themes.hiphop;
  }
  if (lower.includes("disco") || lower.includes("funk")) {
    return themes.disco;
  }
  if (lower.includes("miami bass") || lower.includes("bass")) {
    return themes.miamiBass;
  }
  return themes.electronic;
}

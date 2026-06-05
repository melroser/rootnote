export type ThemeTexture =
  | "none"
  | "vinyl"
  | "paper"
  | "static"
  | "neon"
  | "western"
  | "metal"
  | "velvet"
  | "zine";

export type EpisodeVisualTheme = {
  name: string;
  mood: string;
  background: string;
  panel: string;
  accent: string;
  secondaryAccent: string;
  text: string;
  mutedText: string;
  texture: ThemeTexture;
};

export type ConnectionType =
  | "sampled"
  | "influenced_by"
  | "same_scene"
  | "uses_technique"
  | "branches_into";

export type Confidence =
  | "confirmed"
  | "likely"
  | "scene_connection"
  | "ai_inferred";

export type MusicConnection = {
  id: string;
  name: string;
  type: ConnectionType;
  confidence: Confidence;
  explanation: string;
};

export type Track = {
  position: number;
  artist: string;
  title: string;
  videoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  listeningNote: string;
  hostScript: string;
  artistContext?: string;
  roots: MusicConnection[];
  branches: MusicConnection[];
};

export type Episode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  hostPersona: string;
  visualTheme: EpisodeVisualTheme;
  tracks: Track[];
  youtubeQueueUrl: string;
  createdAt: string;
};

export type SavedEpisode = Episode;

export type DeepDiveContent = {
  title: string;
  summary: string;
  whyThisMatters: string;
  context: string;
};

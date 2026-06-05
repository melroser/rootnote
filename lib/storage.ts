import type { SavedEpisode } from "@/types/rootnote";

const STORAGE_KEY = "rootnote.savedEpisodes.v1";

export function loadSavedEpisodes(): SavedEpisode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedEpisode[]) : [];
  } catch {
    return [];
  }
}

function persist(episodes: SavedEpisode[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
  } catch {
    // ignore quota / serialization errors for the MVP
  }
}

export function saveEpisode(episode: SavedEpisode): SavedEpisode[] {
  const existing = loadSavedEpisodes().filter((e) => e.id !== episode.id);
  const next = [episode, ...existing];
  persist(next);
  return next;
}

export function deleteEpisode(id: string): SavedEpisode[] {
  const next = loadSavedEpisodes().filter((e) => e.id !== id);
  persist(next);
  return next;
}

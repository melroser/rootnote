import type { DeepDiveContent, Episode } from "@/types/rootnote";
import { girlsToTheFrontEpisode } from "@/lib/episodes/girlsToTheFront";
import { internetBrokeMusicEpisode } from "@/lib/episodes/internetBrokeMusic";
import { songsImpossibleEpisode } from "@/lib/episodes/songsImpossible";
import { whereSampleCameFromEpisode } from "@/lib/episodes/whereSampleCameFrom";
import {
  michaelJacksonDeepDives,
  michaelJacksonEpisode,
} from "@/lib/episodes/michaelJackson";

/**
 * Curated episodes keyed by their stable preset id. The Miami Bass episode is
 * kept in demoEpisode.ts (it is the original, committed show) and registered
 * there alongside these.
 */
export const curatedEpisodes: Episode[] = [
  girlsToTheFrontEpisode,
  internetBrokeMusicEpisode,
  songsImpossibleEpisode,
  whereSampleCameFromEpisode,
  michaelJacksonEpisode,
];

// Deep-dive content contributed by individual episodes, merged into the global
// lookup so the "Dive deeper" panel can render rich context for their nodes.
export const episodeDeepDives: Record<string, DeepDiveContent> = {
  ...michaelJacksonDeepDives,
};

export {
  girlsToTheFrontEpisode,
  internetBrokeMusicEpisode,
  songsImpossibleEpisode,
  whereSampleCameFromEpisode,
  michaelJacksonEpisode,
};

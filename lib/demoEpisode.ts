import type {
  DeepDiveContent,
  Episode,
  MusicConnection,
  Track,
} from "@/types/rootnote";
import { getThemeForPrompt, themes } from "@/lib/themes";
import { makeYouTubeQueueUrl, thumbnailUrl, watchUrl } from "@/lib/youtube";

function track(
  partial: Omit<Track, "youtubeUrl" | "thumbnailUrl">
): Track {
  return {
    ...partial,
    youtubeUrl: watchUrl(partial.videoId),
    thumbnailUrl: thumbnailUrl(partial.videoId),
  };
}

// Full ancestry tree for the M.C. A.D.E. track (spec section 13).
const adeRoots: MusicConnection[] = [
  {
    id: "roland-tr-808",
    name: "Roland TR 808",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "The 808 kick gives Miami bass its physical identity. It is not just percussion. It becomes a low frequency instrument.",
  },
  {
    id: "electro-funk",
    name: "Electro funk",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Machine rhythms, robotic vocals, and dance floor structure flow into the early Miami bass vocabulary.",
  },
  {
    id: "afrika-bambaataa",
    name: "Afrika Bambaataa and Soulsonic Force",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Early electro and hip hop records helped establish the futuristic drum machine language that Miami bass would push into a heavier regional sound.",
  },
  {
    id: "kraftwerk",
    name: "Kraftwerk",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Kraftwerk's machine rhythms echo through electro, hip hop, freestyle, and the robotic side of Miami bass.",
  },
  {
    id: "miami-car-audio",
    name: "Miami car audio culture",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "This music makes the most sense when you imagine it coming out of a trunk with too much subwoofer. The playback system is part of the style.",
  },
  {
    id: "party-rap",
    name: "Party rap",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Call and response vocals, chants, and simple crowd instructions turn the track into a social tool.",
  },
];

const adeBranches: MusicConnection[] = [
  {
    id: "2-live-crew",
    name: "2 Live Crew",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "They made Miami bass nationally visible and controversial, turning local party music into a free speech flashpoint.",
  },
  {
    id: "booty-bass",
    name: "Booty bass",
    type: "branches_into",
    confidence: "scene_connection",
    explanation:
      "Miami bass helped shape a broader party music lane built around bass, sex, chant hooks, and crowd movement.",
  },
  {
    id: "southern-club-rap",
    name: "Southern club rap",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "The bass heavy, chant driven, party oriented DNA carries forward into Southern club records.",
  },
  {
    id: "baltimore-club",
    name: "Baltimore club",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "Different city, different rhythm, but the idea of regional party music built for immediate dance floor response connects the scenes.",
  },
  {
    id: "jersey-club",
    name: "Jersey club",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "Jersey club continues the regional club music lineage: functional, rhythmic, repetitive, local, and built to move people.",
  },
  {
    id: "twerk-music",
    name: "Twerk music",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "Modern twerk production inherits a lot from bass music's focus on low end, movement, and chantable hooks.",
  },
  {
    id: "edm-trap",
    name: "EDM trap",
    type: "branches_into",
    confidence: "ai_inferred",
    explanation:
      "Some of the festival era bass vocabulary echoes older bass music ideas: sub pressure, drops, crowd commands, and exaggerated low end.",
  },
];

// Lighter but real trees so "Trace roots" works on every track.
const electroRoots: MusicConnection[] = [
  adeRoots[0],
  adeRoots[1],
  adeRoots[3],
];

const liveCrewRoots: MusicConnection[] = [
  adeRoots[0],
  adeRoots[5],
  adeRoots[4],
];

const liveCrewBranches: MusicConnection[] = [
  adeBranches[1],
  adeBranches[2],
  {
    id: "free-speech-fight",
    name: "Free speech fights",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "The obscenity trials around 2 Live Crew turned a party record into a national argument about censorship and the First Amendment.",
  },
];

const maggotronBranches: MusicConnection[] = [
  adeBranches[5],
  adeBranches[6],
];

const MIAMI_PROMPT =
  "Make me an introduction to Miami bass like a late night college radio DJ. Explain the 808s, car systems, booty music, electro roots, 2 Live Crew, Pretty Tony, MC ADE, and why Miami matters.";

const miamiTracks: Track[] = [
  track({
    position: 1,
    artist: "Pretty Tony",
    title: "Fix It in the Mix",
    videoId: "UzM19qqGQ8M",
    listeningNote: "Electro roots before the bass becomes the main character.",
    hostScript:
      "You are hearing the machinery before the party gets completely out of control. Pretty Tony sits in that bridge between electro, freestyle, and Miami bass. The drums are clean, the synths are shiny, and the whole thing feels like a city discovering that a drum machine could become a local accent.",
    artistContext:
      "A foundational Miami producer who helped translate electro and freestyle into the early Miami bass sound.",
    roots: electroRoots,
    branches: [adeBranches[0], adeBranches[1]],
  }),
  track({
    position: 2,
    artist: "M.C. A.D.E.",
    title: "Bass Rock Express",
    videoId: "lfmbqiRcUKo",
    listeningNote: "The low end moves from support role to headline act.",
    hostScript:
      "This is where the bass stops being decoration and becomes the main character. Miami bass is car speaker music. If you are hearing this on laptop speakers, you are missing the whole argument. The trunk rattle is part of the arrangement.",
    artistContext:
      "A Miami bass pioneer whose records helped define bass as the center of the track, not just the bottom of it. The music sits between electro, party rap, local club culture, and car audio systems.",
    roots: adeRoots,
    branches: adeBranches,
  }),
  track({
    position: 3,
    artist: "2 Live Crew",
    title: "Throw the D",
    videoId: "1d6Y7LxhGMg",
    listeningNote: "Party chants, controversy, and bass music as public disturbance.",
    hostScript:
      "You can hear why people either loved this or wanted it banned immediately. It is direct, repetitive, obscene, funny, and built for crowd reaction. This is not music asking to be admired quietly. It is music organizing bodies in a room.",
    artistContext:
      "The group that made Miami bass impossible to ignore nationally, turning local party music into a free speech flashpoint.",
    roots: liveCrewRoots,
    branches: liveCrewBranches,
  }),
  track({
    position: 4,
    artist: "2 Live Crew",
    title: "Get It Girl",
    videoId: "swNnojzHYzo",
    listeningNote: "Bass music as crowd instruction.",
    hostScript:
      "One of the biggest lessons of Miami bass is that sometimes the job of a song is not lyrical subtlety. Sometimes the job is to tell a room exactly what to yell back and exactly when to move.",
    artistContext:
      "2 Live Crew leaning all the way into call and response crowd control.",
    roots: liveCrewRoots,
    branches: liveCrewBranches,
  }),
  track({
    position: 5,
    artist: "2 Live Crew",
    title: "Move Somethin",
    videoId: "791N0z1q6RU",
    listeningNote: "Momentum, volume, and physical playback.",
    hostScript:
      "The title is basically the thesis. Move something. The bass, the crowd, the car, the city. These records can seem simple until you imagine the playback system they were made for.",
    artistContext:
      "2 Live Crew making the case that the song and the sound system are one instrument.",
    roots: liveCrewRoots,
    branches: liveCrewBranches,
  }),
  track({
    position: 6,
    artist: "2 Live Crew",
    title: "The Megamix",
    videoId: "sYm9GXF1V-s",
    listeningNote: "Miami bass as DJ material.",
    hostScript:
      "The megamix format tells you a lot. These tracks were made to be cut up, extended, shouted over, and thrown together by DJs. The record is not a museum object. It is ammunition.",
    artistContext:
      "Miami bass in its DJ tool form, built to be recombined on the fly.",
    roots: liveCrewRoots,
    branches: liveCrewBranches,
  }),
  track({
    position: 7,
    artist: "Maggotron Crushing Crew",
    title: "Bass It to the Max",
    videoId: "mtXmv4sbITQ",
    listeningNote: "Robotic, cartoonish, exaggerated bass futurism.",
    hostScript:
      "This is where Miami bass starts sounding like electro got sunburned, bought subwoofers, and decided subtlety was a scam. It is sci fi, ridiculous, mechanical, and totally committed.",
    artistContext:
      "Maggotron pushed the robotic, sci-fi extreme of Miami bass futurism.",
    roots: electroRoots,
    branches: maggotronBranches,
  }),
  track({
    position: 8,
    artist: "Miami Bass Mix",
    title: "Miami Bass Mix",
    videoId: "ipMpasn1BjQ",
    listeningNote: "The records in their natural habitat.",
    hostScript:
      "To close it out, we are going into mix mode. This is the natural habitat of the sound: stacked, loud, continuous, and built less like a lecture than a party spilling into the street.",
    artistContext:
      "A continuous mix that shows how these records live together on a system.",
    roots: [adeRoots[4]],
    branches: [adeBranches[3], adeBranches[4]],
  }),
];

export const miamiBassEpisode: Episode = {
  id: "miami-bass-101",
  slug: "miami-bass-101",
  title: "Miami Bass 101: 808s, Booty Music, Car Systems, and Free Speech",
  description:
    "A late night tour through Miami bass, from electro roots and 808 drum machines to 2 Live Crew, car audio culture, party chants, censorship fights, and the sound of bass becoming the main character.",
  prompt: MIAMI_PROMPT,
  hostPersona:
    "Late night college radio DJ. Smart but not academic. Specific, funny, and slightly conspiratorial. Speaks like someone who loves music history but still wants the record to hit.",
  visualTheme: themes.miamiBass,
  tracks: miamiTracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(miamiTracks.map((t) => t.videoId)),
  createdAt: "2026-01-01T00:00:00.000Z",
};

// Deep dive panel content (spec section 14).
const deepDives: Record<string, DeepDiveContent> = {
  "roland tr 808": {
    title: "808 drum machines",
    summary:
      "The drum machine source behind a huge part of bass music, hip hop, electro, house, trap, and pop.",
    whyThisMatters:
      "In Miami bass, the 808 is not only a drum sound. It is the center of gravity. The kick is tuned, extended, and played through systems where you feel it physically.",
    context:
      "This connects Miami bass to electro, party rap, skating rinks, block parties, car audio culture, Southern club music, trap, and modern bass music.",
  },
  "electro funk": {
    title: "Electro funk",
    summary:
      "A machine funk root source: robotic grooves, drum machines, synth bass, and dance floor futurism.",
    whyThisMatters:
      "Electro gave Miami bass a rhythmic and technological vocabulary before the local scene pushed the sub bass and party chants harder.",
    context:
      "This connects Kraftwerk, Afrika Bambaataa, freestyle, breakdance culture, early hip hop, and regional bass scenes.",
  },
  "2 live crew": {
    title: "2 Live Crew",
    summary: "The group that made Miami bass impossible to ignore nationally.",
    whyThisMatters:
      "They turned local bass music into a national story about obscenity, race, region, humor, and free speech.",
    context:
      "This connects Luke Records, Miami bass, censorship fights, Southern rap, booty bass, and later club rap.",
  },
};

deepDives["808 drum machines"] = deepDives["roland tr 808"];

export function getDeepDive(node: MusicConnection): DeepDiveContent {
  const found = deepDives[node.name.toLowerCase()];
  if (found) return found;
  return {
    title: node.name,
    summary: node.explanation,
    whyThisMatters: node.explanation,
    context:
      "This is part of the wider web of scenes, techniques, and artists that Rootnote traces around each record. Make an episode from here to dig in.",
  };
}

// Preset metadata so non-Miami prompts still produce something themed.
type PresetMeta = {
  id: string;
  label: string;
  prompt: string;
  title: string;
  description: string;
  hostPersona: string;
};

export const presets: PresetMeta[] = [
  {
    id: "miami-bass",
    label: "Miami Bass 101",
    prompt: MIAMI_PROMPT,
    title: miamiBassEpisode.title,
    description: miamiBassEpisode.description,
    hostPersona: miamiBassEpisode.hostPersona,
  },
  {
    id: "girls-to-the-front",
    label: "Girls to the Front",
    prompt:
      "Make me a guided radio episode about unsung women and queer artists who shaped punk, post punk, riot grrrl, and dance punk. Include artists like The Slits, X Ray Spex, Bikini Kill, Le Tigre, Sleater Kinney, and Yeah Yeah Yeahs.",
    title: "Girls to the Front: Punk, Post Punk, and Riot Grrrl Rewired",
    description:
      "A guided tour through the women and queer artists who rewired punk, post punk, riot grrrl, and dance punk, and the noise they made on purpose.",
    hostPersona:
      "Late night college radio DJ with a zine collection. Political, warm, specific, and allergic to clichés.",
  },
  {
    id: "internet-broke-music",
    label: "The Internet Broke Music",
    prompt:
      "Make me a radio episode about how MySpace, LimeWire, YouTube, SoundCloud, TikTok, and Discord changed what music sounds like.",
    title: "The Internet Broke Music",
    description:
      "How MySpace, LimeWire, YouTube, SoundCloud, TikTok, and Discord rewired what music sounds like and who gets to make it.",
    hostPersona:
      "Late night college radio DJ who lived through every platform. Curious, a little conspiratorial, never nostalgic for its own sake.",
  },
  {
    id: "songs-impossible",
    label: "Songs That Sounded Impossible",
    prompt:
      "Make me a guided listening episode about songs that sounded strange or futuristic when they came out, but later changed everyone's ears.",
    title: "Songs That Sounded Impossible",
    description:
      "Records that sounded strange or futuristic on arrival, and then quietly changed everyone's ears.",
    hostPersona:
      "Late night college radio DJ fascinated by the moment a sound goes from alien to obvious.",
  },
  {
    id: "where-sample-came-from",
    label: "Where That Sample Came From",
    prompt:
      "Make me a guided radio episode where famous songs are traced backward to the samples, source records, and scenes hiding inside them.",
    title: "Where That Sample Came From",
    description:
      "Famous songs traced backward to the samples, source records, and scenes hiding inside them.",
    hostPersona:
      "Late night college radio DJ playing detective, following every record back to the one it was hiding.",
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function isMiamiPrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return lower.includes("miami bass") || lower.includes("miami");
}

function deriveTitle(prompt: string): string {
  const cleaned = prompt
    .replace(/^make me (an?|a)\s*/i, "")
    .replace(/^make me\s*/i, "")
    .trim();
  const firstChunk = cleaned.split(/[.,]/)[0].trim();
  if (!firstChunk) return "A Rootnote Episode";
  return firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);
}

/**
 * Synchronous, fully mocked episode generation. The Miami Bass demo is the
 * real, fully-populated episode. Any other prompt returns a themed "preview"
 * episode built from the playable demo clips so nothing breaks on stage.
 */
export function generateEpisode(prompt: string): Episode {
  const trimmed = prompt.trim();
  if (isMiamiPrompt(trimmed) || trimmed.length === 0) {
    return {
      ...miamiBassEpisode,
      id: `episode-${Date.now()}`,
      prompt: trimmed || miamiBassEpisode.prompt,
      createdAt: new Date().toISOString(),
    };
  }

  const preset = presets.find((p) => p.prompt === trimmed);
  const theme = getThemeForPrompt(trimmed);
  const title = preset?.title ?? deriveTitle(trimmed);
  const description =
    preset?.description ??
    "A guided listening preview, themed to your prompt. Real generation is a stretch goal; these are playable demo clips for now.";
  const hostPersona =
    preset?.hostPersona ??
    "Late night college radio DJ. Smart but not academic. Specific, warm, and slightly conspiratorial.";

  return {
    id: `episode-${Date.now()}`,
    slug: slugify(title) || "rootnote-episode",
    title,
    description,
    prompt: trimmed,
    hostPersona,
    visualTheme: theme,
    tracks: miamiTracks,
    youtubeQueueUrl: makeYouTubeQueueUrl(miamiTracks.map((t) => t.videoId)),
    createdAt: new Date().toISOString(),
  };
}

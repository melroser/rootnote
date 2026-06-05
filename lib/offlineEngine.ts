import type {
  Episode,
  EpisodeVisualTheme,
  MusicConnection,
  Track,
} from "@/types/rootnote";
import { getThemeForPrompt } from "@/lib/themes";
import { makeYouTubeSearchQueueUrl } from "@/lib/youtube";
import { searchTrack } from "@/lib/episodes/helpers";

// A seed is a known, real song. The offline engine plays it via YouTube search
// (no trusted videoId), and the UI surfaces a "Search on YouTube" fallback.
type Seed = {
  artist: string;
  title: string;
  note: string;
  why: string;
};

type GenrePool = {
  key: string;
  label: string;
  root: { name: string; explanation: string };
  branch: { name: string; explanation: string };
  seeds: Seed[];
};

const POOLS: GenrePool[] = [
  {
    key: "hiphop",
    label: "hip hop",
    root: {
      name: "The break and the sample",
      explanation:
        "Hip hop is built on looped drum breaks and recombined records, turning the DJ and the producer into composers.",
    },
    branch: {
      name: "Modern rap and trap",
      explanation:
        "The sampling, chant, and rhythm vocabulary keeps mutating forward into every later strain of rap.",
    },
    seeds: [
      { artist: "Grandmaster Flash & The Furious Five", title: "The Message", note: "The record that proved rap could report from the street.", why: "Storytelling rap arrives, and the genre grows a conscience." },
      { artist: "A Tribe Called Quest", title: "Electric Relaxation", note: "Jazz-literate, dusty, effortlessly cool.", why: "The bohemian, crate-digging side of golden-age rap." },
      { artist: "Nas", title: "N.Y. State of Mind", note: "Cinematic lyricism over a haunted piano loop.", why: "Lyricism as the main event." },
      { artist: "OutKast", title: "B.O.B.", note: "Southern rap at impossible speed and ambition.", why: "Proof the South would rewrite the genre's center of gravity." },
      { artist: "Kendrick Lamar", title: "Alright", note: "A protest anthem disguised as a hook.", why: "Where rap, jazz, and the moment collide." },
      { artist: "J Dilla", title: "Workinonit", note: "The drunk, human swing that reprogrammed a generation of beatmakers.", why: "The producer as auteur." },
    ],
  },
  {
    key: "rnb",
    label: "R&B and soul",
    root: {
      name: "Gospel and soul phrasing",
      explanation:
        "R&B carries the melisma, call-and-response, and emotional directness of the Black church and classic soul.",
    },
    branch: {
      name: "Alternative and future R&B",
      explanation:
        "The intimacy and groove keep evolving into moody, electronic, genre-blurring strains of modern R&B.",
    },
    seeds: [
      { artist: "Marvin Gaye", title: "What's Going On", note: "Soul as a worried, gorgeous question.", why: "The album-as-statement era of R&B begins." },
      { artist: "Stevie Wonder", title: "As", note: "Joy engineered down to the chord changes.", why: "The peak of the singer-songwriter-instrumentalist." },
      { artist: "D'Angelo", title: "Untitled (How Does It Feel)", note: "Slow, woozy, impossibly intimate.", why: "Neo-soul's loose, live-feel revival." },
      { artist: "Erykah Badu", title: "On & On", note: "Hip hop swing meets jazz phrasing.", why: "The bohemian center of neo-soul." },
      { artist: "Frank Ocean", title: "Thinkin Bout You", note: "Falsetto and negative space.", why: "Confessional, genre-loose future R&B." },
      { artist: "SZA", title: "Love Galore", note: "Diaristic writing over hazy, modern production.", why: "Where R&B and the streaming era meet." },
    ],
  },
  {
    key: "punk",
    label: "punk and post-punk",
    root: {
      name: "DIY and three chords",
      explanation:
        "Punk's founding promise is that anyone can form a band, that energy and intent beat technical polish.",
    },
    branch: {
      name: "Indie and alternative",
      explanation:
        "The DIY ethic and raw urgency seed decades of independent, alternative, and underground rock.",
    },
    seeds: [
      { artist: "The Stooges", title: "Search and Destroy", note: "Proto-punk as a controlled explosion.", why: "The blueprint for everything louder and faster." },
      { artist: "Ramones", title: "Blitzkrieg Bop", note: "Three chords, one chant, total clarity.", why: "Punk distilled to its fighting weight." },
      { artist: "Wire", title: "Three Girl Rhumba", note: "Art-school minimalism with a sneer.", why: "Post-punk's brainy, angular turn." },
      { artist: "Joy Division", title: "Disorder", note: "Cold, propulsive, and strangely danceable dread.", why: "Post-punk as atmosphere and architecture." },
      { artist: "Fugazi", title: "Waiting Room", note: "Hardcore with funk in its bones and ethics on its sleeve.", why: "DIY as a complete way of operating." },
      { artist: "Pixies", title: "Debaser", note: "Quiet-loud dynamics that rewired alternative rock.", why: "The hinge between punk and the nineties." },
    ],
  },
  {
    key: "metal",
    label: "metal",
    root: {
      name: "Heavy blues and volume",
      explanation:
        "Metal grows out of amplified blues pushed to extremes of volume, distortion, and riff.",
    },
    branch: {
      name: "Extreme and modern metal",
      explanation:
        "The riff and intensity branch endlessly into thrash, death, doom, black metal, and beyond.",
    },
    seeds: [
      { artist: "Black Sabbath", title: "Iron Man", note: "The riff that invented the genre's gravity.", why: "Heavy metal's ground zero." },
      { artist: "Metallica", title: "Master of Puppets", note: "Thrash with symphonic ambition.", why: "Speed and structure fused at scale." },
      { artist: "Slayer", title: "Raining Blood", note: "Pure velocity and menace.", why: "Thrash pushed to its sharpest edge." },
      { artist: "Tool", title: "Schism", note: "Odd meters as a hypnotic puzzle.", why: "Metal as cerebral, progressive art." },
      { artist: "Mastodon", title: "Blood and Thunder", note: "Sludge, prog, and sheer momentum.", why: "Modern metal's expansive ambition." },
      { artist: "Gojira", title: "Stranded", note: "Mechanical heaviness with an ecological conscience.", why: "Where contemporary metal is heading." },
    ],
  },
  {
    key: "country",
    label: "country and Americana",
    root: {
      name: "Folk and honky-tonk roots",
      explanation:
        "Country grows from folk balladry, gospel, and honky-tonk: plain language, real instruments, hard truths.",
    },
    branch: {
      name: "Alt-country and Americana",
      explanation:
        "The songwriting tradition keeps branching into outlaw, alt-country, and genre-blurring Americana.",
    },
    seeds: [
      { artist: "Johnny Cash", title: "Folsom Prison Blues", note: "Plainspoken menace and a freight-train rhythm.", why: "Country's outlaw heart." },
      { artist: "Dolly Parton", title: "Jolene", note: "A perfect song built on pure tension.", why: "Songwriting craft at its peak." },
      { artist: "Willie Nelson", title: "Whiskey River", note: "Phrasing that floats behind the beat.", why: "The outlaw country revolution." },
      { artist: "Lucinda Williams", title: "Car Wheels on a Gravel Road", note: "Literary detail over road-worn twang.", why: "Americana's poetic turn." },
      { artist: "Sturgill Simpson", title: "Turtles All the Way Down", note: "Classic country sound, cosmic lyrics.", why: "The modern outlaw revival." },
      { artist: "Kacey Musgraves", title: "Slow Burn", note: "Country songwriting with a dreamy, modern sheen.", why: "Where Nashville meets the wider pop world." },
    ],
  },
  {
    key: "disco",
    label: "disco and funk",
    root: {
      name: "Funk rhythm and four-on-the-floor",
      explanation:
        "Disco fuses funk's rhythm section with a steady kick and lush strings, all built for the dance floor.",
    },
    branch: {
      name: "House and dance-pop",
      explanation:
        "The groove and production lessons flow straight into house, boogie, and decades of dance-pop.",
    },
    seeds: [
      { artist: "Chic", title: "Good Times", note: "The bassline that launched a thousand records.", why: "Disco's DNA and hip hop's first loop." },
      { artist: "Earth, Wind & Fire", title: "September", note: "Joy as precision engineering.", why: "Funk-disco at its most euphoric." },
      { artist: "Sister Sledge", title: "He's the Greatest Dancer", note: "Rodgers and Edwards at the controls.", why: "The Chic production blueprint." },
      { artist: "Donna Summer", title: "I Feel Love", note: "Fully electronic disco from the future.", why: "The bridge to house and techno." },
      { artist: "Daft Punk", title: "One More Time", note: "Disco resurrected through filters and vocoder.", why: "French touch returns the favor." },
      { artist: "Jamiroquai", title: "Canned Heat", note: "Funk revival with a falsetto and a groove.", why: "Disco's long, danceable afterlife." },
    ],
  },
  {
    key: "ambient",
    label: "ambient and experimental",
    root: {
      name: "Tape, drone, and texture",
      explanation:
        "Ambient music treats texture, space, and slow time as the main material rather than melody or beat.",
    },
    branch: {
      name: "Modern electronic and post-rock",
      explanation:
        "The focus on atmosphere feeds ambient techno, post-rock, and a century of mood-first music.",
    },
    seeds: [
      { artist: "Brian Eno", title: "An Ending (Ascent)", note: "The genre's patron saint, defining 'ambient.'", why: "Music as a place, not an event." },
      { artist: "Aphex Twin", title: "Rhubarb", note: "Synth pads that ache.", why: "Ambient with an electronic heart." },
      { artist: "Boards of Canada", title: "Roygbiv", note: "Warm, nostalgic, slightly haunted.", why: "Memory rendered as sound." },
      { artist: "Stars of the Lid", title: "Don't Bother They're Here", note: "Drone as slow-motion orchestra.", why: "The deep end of ambient." },
      { artist: "Tim Hecker", title: "Harmony in Ultraviolet", note: "Beautiful sound eroding in real time.", why: "Ambient as texture and decay." },
      { artist: "Grouper", title: "Heavy Water/I'd Rather Be Sleeping", note: "Voice dissolving into reverb.", why: "Intimacy at the edge of silence." },
    ],
  },
  {
    key: "electronic",
    label: "electronic",
    root: {
      name: "Synthesizers and machine rhythm",
      explanation:
        "Electronic music builds from synths, drum machines, and sequencers: sound designed rather than performed.",
    },
    branch: {
      name: "Club music and pop production",
      explanation:
        "Electronic technique becomes the backbone of club music and, eventually, almost all modern pop.",
    },
    seeds: [
      { artist: "Kraftwerk", title: "The Robots", note: "Machines with melodies and a sense of humor.", why: "The source code for electronic pop." },
      { artist: "Aphex Twin", title: "Windowlicker", note: "Impossible rhythms, human feeling.", why: "Sound design as composition." },
      { artist: "Daft Punk", title: "Around the World", note: "Hypnotic repetition as a hook.", why: "House music goes global." },
      { artist: "Burial", title: "Archangel", note: "Crackle, rain, and ghostly garage.", why: "Electronic music as urban memory." },
      { artist: "Caribou", title: "Odessa", note: "Warm, organic, and danceable.", why: "Where electronic and indie merge." },
      { artist: "Jamie xx", title: "Gosh", note: "Club euphoria built from tiny fragments.", why: "Modern electronic as collage." },
    ],
  },
];

function poolForPrompt(prompt: string): GenrePool {
  const lower = prompt.toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => lower.includes(k));
  if (has("metal", "doom", "thrash")) return byKey("metal");
  if (has("country", "americana", "western", "bluegrass")) return byKey("country");
  if (has("r&b", "rnb", "soul", "neo-soul", "neo soul")) return byKey("rnb");
  if (has("punk", "riot grrrl", "post punk", "post-punk", "hardcore"))
    return byKey("punk");
  if (has("ambient", "drone", "meditation", "experimental"))
    return byKey("ambient");
  if (has("hip hop", "hip-hop", "rap", "boom bap", "sample"))
    return byKey("hiphop");
  if (has("disco", "funk", "house", "boogie")) return byKey("disco");
  return byKey("electronic");
}

function byKey(key: string): GenrePool {
  return POOLS.find((p) => p.key === key) ?? POOLS[POOLS.length - 1];
}

function buildConnections(pool: GenrePool): {
  roots: MusicConnection[];
  branches: MusicConnection[];
} {
  return {
    roots: [
      {
        id: `${pool.key}-root`,
        name: pool.root.name,
        type: "influenced_by",
        confidence: "scene_connection",
        explanation: pool.root.explanation,
      },
    ],
    branches: [
      {
        id: `${pool.key}-branch`,
        name: pool.branch.name,
        type: "branches_into",
        confidence: "scene_connection",
        explanation: pool.branch.explanation,
      },
    ],
  };
}

function titleFromPrompt(prompt: string): string {
  const cleaned = prompt
    .replace(/^make me (an?|a)\s*/i, "")
    .replace(/^make me\s*/i, "")
    .replace(/^(a |an )?(guided |radio |listening )?(episode|show|playlist)\s*(about|on|exploring)?\s*/i, "")
    .trim();
  const firstChunk = cleaned.split(/[.,\n]/)[0].trim();
  const base = firstChunk || "Your Rabbit Hole";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "rootnote-episode"
  );
}

/**
 * The no-key / fallback engine. Produces a themed, coherent, playable episode
 * for ANY prompt by selecting a genre pool from keywords. Tracks play via
 * YouTube search (no trusted videoIds), so the player shows a search fallback.
 */
export function buildOfflineEpisode(prompt: string): Episode {
  const trimmed = prompt.trim();
  const theme: EpisodeVisualTheme = getThemeForPrompt(trimmed);
  const pool = poolForPrompt(trimmed);
  const { roots, branches } = buildConnections(pool);
  const subject = titleFromPrompt(trimmed);

  const tracks: Track[] = pool.seeds.map((seed, i) =>
    searchTrack({
      position: i + 1,
      artist: seed.artist,
      title: seed.title,
      listeningNote: seed.note,
      hostScript:
        i === 0
          ? `Let's open this ${pool.label} rabbit hole the right way. ${seed.artist} with ${seed.title}. ${seed.why} Consider this our doorway into the sound you asked about.`
          : `${seed.artist}, ${seed.title}. ${seed.note} ${seed.why}`,
      artistContext: `A cornerstone of ${pool.label}, included to map the territory around your prompt.`,
      roots,
      branches,
    })
  );

  return {
    id: `episode-${Date.now()}`,
    slug: slugify(subject),
    title: subject,
    description: `A guided ${pool.label} listening session themed to your prompt. These are real, iconic tracks played through YouTube search, with the roots and branches mapped around the sound.`,
    prompt: trimmed,
    hostPersona:
      "Late night college radio DJ. Smart but not academic. Specific, warm, and slightly conspiratorial.",
    visualTheme: theme,
    tracks,
    youtubeQueueUrl: makeYouTubeSearchQueueUrl(
      tracks.map((t) => t.searchQuery ?? `${t.artist} ${t.title}`)
    ),
    createdAt: new Date().toISOString(),
  };
}

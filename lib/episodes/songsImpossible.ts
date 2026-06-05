import type { Episode, MusicConnection, Track } from "@/types/rootnote";
import { themes } from "@/lib/themes";
import { makeYouTubeQueueUrl } from "@/lib/youtube";
import { track } from "@/lib/episodes/helpers";

const PROMPT =
  "Make me a guided listening episode about songs that sounded strange or futuristic when they came out, but later changed everyone's ears.";

const iFeelLoveRoots: MusicConnection[] = [
  {
    id: "moog-modular",
    name: "The Moog modular synthesizer",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Almost everything you hear is synthesized. Giorgio Moroder built the entire bed out of a Moog, so the record sounds less like a band and more like a machine dreaming about disco.",
  },
  {
    id: "sequenced-bassline",
    name: "The sequenced bassline",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "That hypnotic pulse is a step sequencer locking the bass to a grid. Letting a machine, not a human, hold the groove was the genuinely futuristic idea, and it became the spine of dance music.",
  },
  {
    id: "kraftwerk-influence",
    name: "Kraftwerk",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "The German notion that machines could be warm, even sensual, rather than cold, is the philosophical permission slip behind a fully electronic love song.",
  },
  {
    id: "moroder-production",
    name: "Giorgio Moroder's production",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Moroder treated the studio as the instrument and the synth as the orchestra, a producer-as-author approach that predicts how electronic and pop records get made today.",
  },
];

const iFeelLoveBranches: MusicConnection[] = [
  {
    id: "house-techno",
    name: "House and techno",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Brian Eno reportedly told David Bowie this single was the future. He was right. The relentless electronic pulse is the direct ancestor of Chicago house and Detroit techno.",
  },
  {
    id: "synth-pop-branch",
    name: "Synth-pop",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Once a synthesizer could carry an entire emotional hit single, the door opened for the all-electronic pop of the eighties and everything after.",
  },
  {
    id: "edm-branch",
    name: "Modern electronic dance music",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "The whole idea of a track built for a long, building, machine-driven trance on a dance floor starts in earnest right here.",
  },
];

const electronicRoots: MusicConnection[] = [
  iFeelLoveRoots[0],
  iFeelLoveRoots[2],
  {
    id: "musique-concrete",
    name: "Musique concrète and tape experiments",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Cutting, splicing, and looping magnetic tape taught composers that recorded sound itself was raw material. That mindset underwrites every strange studio creation that followed.",
  },
];

const futureEars: MusicConnection[] = [
  {
    id: "studio-as-instrument",
    name: "The studio as an instrument",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Once the mixing desk, the tape machine, and later the sampler became playable, songs could be sculpted rather than merely performed.",
  },
  {
    id: "sampler-glitch",
    name: "Samplers and digital glitch",
    type: "uses_technique",
    confidence: "likely",
    explanation:
      "Treating digital errors, stutters, and impossible edits as beauty rather than mistakes reshaped what listeners were willing to call a song.",
  },
];

const tracks: Track[] = [
  track({
    position: 1,
    artist: "Delia Derbyshire / BBC Radiophonic Workshop",
    title: "Doctor Who Theme (1963)",
    videoId: "2f-0tCFJX9o",
    listeningNote: "Electronic music from before synthesizers basically existed.",
    hostScript:
      "Start in 1963. There are no synthesizers to speak of, so Delia Derbyshire builds this out of test-tone oscillators and tape, cutting it together by hand, splice by splice. People heard it on their televisions and had no category for it. It sounded like it was beamed in from a future that hadn't happened yet. In a sense, it had.",
    artistContext:
      "Realized by Delia Derbyshire at the BBC Radiophonic Workshop from Ron Grainer's score, using tape manipulation and electronic tones years ahead of commercial synths.",
    roots: electronicRoots,
    branches: [futureEars[0], iFeelLoveBranches[1]],
  }),
  track({
    position: 2,
    artist: "The Beach Boys",
    title: "Good Vibrations",
    videoId: "apBWI6xrbLY",
    listeningNote: "A pocket symphony assembled from impossible pieces.",
    hostScript:
      "1966. Brian Wilson stops thinking in songs and starts thinking in modular sections, recording fragments across different studios and editing them into one impossible whole. And that eerie wail? An Electro-Theremin. Audiences had never heard pop architecture like this. He proved the studio could be the instrument, which is a door almost everyone walks through afterward.",
    artistContext:
      "Brian Wilson's 'pocket symphony' was built from separately recorded modular sections and exotic instruments, redefining what a pop single could be.",
    roots: [electronicRoots[0], futureEars[0]],
    branches: [futureEars[0]],
  }),
  track({
    position: 3,
    artist: "Donna Summer",
    title: "I Feel Love",
    videoId: "yEbaeLv-aOo",
    listeningNote: "The record that sounded like tomorrow and became it.",
    hostScript:
      "1977, and this is our anchor. Almost nothing here is acoustic. Giorgio Moroder builds the whole thing on a Moog, with a sequencer holding that hypnotic pulse instead of a human. The story goes that Brian Eno ran into the studio telling Bowie he'd just heard the sound of the future. He wasn't exaggerating. House, techno, synth-pop, all of modern dance music has this single in its DNA.",
    artistContext:
      "Donna Summer and Giorgio Moroder's fully electronic disco track, widely cited as the blueprint for house, techno, and synth-driven pop.",
    roots: iFeelLoveRoots,
    branches: iFeelLoveBranches,
  }),
  track({
    position: 4,
    artist: "Kraftwerk",
    title: "Trans-Europe Express",
    videoId: "PHiN26vn2ec",
    listeningNote: "Robotic, romantic, and quietly seismic for hip hop.",
    hostScript:
      "Kraftwerk, also 1977, sounding like four machines that learned to feel nostalgia. It's clean, mechanical, hypnotic. And here's the twist that proves how futuristic it was: a few years later Afrika Bambaataa builds Planet Rock on this exact rhythm, and electro and early hip hop are born. The most German, most robotic record imaginable becomes foundational to the Bronx.",
    artistContext:
      "German pioneers whose precise, melodic machine music shaped synth-pop, electro, techno, and, via 'Planet Rock,' hip hop.",
    roots: [iFeelLoveRoots[2], iFeelLoveRoots[1]],
    branches: [iFeelLoveBranches[0], iFeelLoveBranches[2]],
  }),
  track({
    position: 5,
    artist: "Daft Punk",
    title: "Around the World",
    videoId: "K0HSD_i2DvA",
    listeningNote: "A vocoder mantra that made robots sound like the most human thing around.",
    hostScript:
      "Jump to 1997. Daft Punk take that machine pulse and make it irresistible and a little uncanny, one phrase repeated until it becomes a meditation. At the time, plenty of people thought repetition this naked couldn't possibly be a real song. Now it sounds like obvious genius. That's the whole theme of tonight: the gap between sounds wrong and sounds inevitable keeps shrinking.",
    artistContext:
      "French house duo whose hypnotic, vocoder-driven minimalism helped move electronic dance music to the center of pop.",
    roots: [iFeelLoveRoots[1], iFeelLoveBranches[0]],
    branches: [iFeelLoveBranches[2]],
  }),
  track({
    position: 6,
    artist: "Aphex Twin",
    title: "Windowlicker",
    videoId: "UBS4Gi1y_nc",
    listeningNote: "Beats that bend like liquid and shouldn't be possible by hand.",
    hostScript:
      "1999, Richard D. James, doing things to rhythm that no drummer could survive. Listen to the snares stretch and warp like the beat is melting. He's treating the computer as an instrument that can do the literally impossible, and finding the beauty in it. A lot of listeners filed this under noise. A generation of producers filed it under instruction manual.",
    artistContext:
      "Aphex Twin pushed digital sound design and rhythmic complexity past human limits, deeply influencing electronic music and beyond.",
    roots: [futureEars[1], electronicRoots[2]],
    branches: [futureEars[1]],
  }),
  track({
    position: 7,
    artist: "Björk",
    title: "All Is Full of Love",
    videoId: "-U3iQGGvnAQ",
    listeningNote: "Tenderness sung over circuitry, decades early.",
    hostScript:
      "Björk, late nineties, singing one of the most tender melodies you'll hear over textures that sound like a server room learning to love. She insisted that electronic sound could be deeply emotional, not chilly. That argument, that the digital can be intimate, basically wins everywhere later. Listen to half of modern pop and you'll hear her position became the consensus.",
    artistContext:
      "Björk fused avant-garde electronic production with raw human emotion, arguing for warmth inside digital sound long before it was common.",
    roots: [futureEars[0], iFeelLoveRoots[3]],
    branches: [futureEars[1]],
  }),
  track({
    position: 8,
    artist: "Radiohead",
    title: "Everything In Its Right Place",
    videoId: "NUnXxh5U25Y",
    listeningNote: "A rock band deletes the guitars and finds the future.",
    hostScript:
      "We close in 2000, with the biggest rock band in the world opening an album with no guitars, just a queasy electric piano and Thom Yorke's voice diced up and rearranged like an instrument. Fans were furious, then converted. That move, a guitar band embracing electronics and the studio as a sculpting tool, told everyone the old categories were finished. Strange becomes obvious. That's how ears change.",
    artistContext:
      "On Kid A, Radiohead abandoned rock conventions for electronic textures and processed vocals, reshaping expectations for mainstream alternative music.",
    roots: [futureEars[0], futureEars[1], electronicRoots[2]],
    branches: [futureEars[1]],
  }),
];

export const songsImpossibleEpisode: Episode = {
  id: "songs-impossible",
  slug: "songs-impossible",
  title: "Songs That Sounded Impossible",
  description:
    "Records that sounded strange or futuristic on arrival, from hand-spliced tape to fully electronic disco, and then quietly changed everyone's ears.",
  prompt: PROMPT,
  hostPersona:
    "Late night college radio DJ fascinated by the moment a sound goes from alien to obvious.",
  visualTheme: themes.ambient,
  tracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(tracks.map((t) => t.videoId)),
  createdAt: "2026-01-04T00:00:00.000Z",
};

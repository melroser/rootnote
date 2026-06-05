import type { Episode, MusicConnection, Track } from "@/types/rootnote";
import { themes } from "@/lib/themes";
import { makeYouTubeQueueUrl } from "@/lib/youtube";
import { track } from "@/lib/episodes/helpers";

const PROMPT =
  "Make me a guided radio episode about unsung women and queer artists who shaped punk, post punk, riot grrrl, and dance punk. Include artists like The Slits, X Ray Spex, Bikini Kill, Le Tigre, Sleater Kinney, and Yeah Yeah Yeahs.";

const rebelGirlRoots: MusicConnection[] = [
  {
    id: "x-ray-spex-poly",
    name: "X-Ray Spex and Poly Styrene",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Poly Styrene's untrained, unbothered howl proved years earlier that a woman could front a punk band and sound like an alarm going off on purpose. Riot grrrl inherited that permission.",
  },
  {
    id: "the-slits-dub",
    name: "The Slits",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "The Slits turned amateurism into a stance, letting dub space and ragged playing become the point. That refusal to be polished is all over the riot grrrl blueprint.",
  },
  {
    id: "olympia-k-records",
    name: "Olympia and the K Records scene",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Olympia, Washington gave riot grrrl a hometown: cheap rent, a college station, K Records, and a community where the audience and the band were basically the same people.",
  },
  {
    id: "zine-network",
    name: "Photocopied zine network",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Riot grrrl was a media strategy as much as a sound. Cut-and-paste zines spread manifestos, lyrics, and contacts faster than any label could, and the look became the genre's visual signature.",
  },
  {
    id: "girls-to-front",
    name: "Girls to the front",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Kathleen Hanna's literal stage instruction reorganized the room: women up front, away from the violence of the pit. The song and the social rule arrived together.",
  },
];

const rebelGirlBranches: MusicConnection[] = [
  {
    id: "le-tigre-electroclash",
    name: "Le Tigre and electroclash",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Kathleen Hanna's next move plugged riot grrrl politics into drum machines and samplers, building the bridge from punk basements to the dance floor.",
  },
  {
    id: "sleater-kinney-branch",
    name: "Sleater-Kinney",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Out of the same Pacific Northwest scene, Sleater-Kinney carried the urgency into something tighter and more musically ferocious, two guitars arguing with each other.",
  },
  {
    id: "pussy-riot-branch",
    name: "Pussy Riot",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "The idea that a band can be a protest, a costume, and a legal risk all at once travels directly from riot grrrl to later confrontational feminist groups worldwide.",
  },
  {
    id: "pop-feminism-branch",
    name: "Mainstream pop feminism",
    type: "branches_into",
    confidence: "ai_inferred",
    explanation:
      "The vocabulary of reclaiming the word girl, of feminism as something you shout from a stage, eventually filtered all the way up into mainstream pop framing.",
  },
];

const punkSceneRoots: MusicConnection[] = [
  rebelGirlRoots[0],
  rebelGirlRoots[1],
  {
    id: "diy-punk-1977",
    name: "1977 DIY punk",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "The original punk promise was simple and radical: here are three chords, now form a band. These artists took it literally and refused to wait for permission.",
  },
];

const danceShift: MusicConnection[] = [
  {
    id: "post-punk-rhythm",
    name: "Post-punk rhythm sections",
    type: "uses_technique",
    confidence: "likely",
    explanation:
      "Angular guitars over a rhythm section that actually wants to move people connects post-punk to the later dance-punk revival.",
  },
  {
    id: "no-wave-art",
    name: "No wave and art school noise",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Downtown New York noise, where dissonance and fashion and attitude all counted as instruments, feeds straight into the early-2000s dance-punk sound.",
  },
];

const tracks: Track[] = [
  track({
    position: 1,
    artist: "X-Ray Spex",
    title: "Oh Bondage! Up Yours!",
    videoId: "FQ2QyCXHUyw",
    listeningNote: "A 1977 alarm bell: saxophone, sloganeering, and zero apology.",
    hostScript:
      "We start in London, 1977, with a teenager named Poly Styrene yelling the politest sounding warning in punk history. Listen to how that saxophone refuses to behave. This is a woman telling you, very cheerfully, that she is nobody's property. Everyone we play tonight is standing on the ground she cleared.",
    artistContext:
      "Fronted by Poly Styrene, a mixed-race teenager in braces, X-Ray Spex put consumer anxiety and bodily autonomy into the bloodstream of punk.",
    roots: punkSceneRoots,
    branches: [rebelGirlBranches[1], rebelGirlBranches[3]],
  }),
  track({
    position: 2,
    artist: "The Slits",
    title: "Typical Girls",
    videoId: "brtGLeNR12g",
    listeningNote: "Punk learning to breathe through dub space.",
    hostScript:
      "Now Notting Hill, a couple of years later. The Slits were told they couldn't play, so they made not-playing-well into an aesthetic. Hear all that space, that reggae bounce. They're mocking the whole idea of the typical girl while inventing a way for punk to actually groove.",
    artistContext:
      "An all-woman London group whose debut Cut fused punk attitude with dub and reggae, produced by Dennis Bovell.",
    roots: punkSceneRoots,
    branches: danceShift,
  }),
  track({
    position: 3,
    artist: "The Raincoats",
    title: "Fairytale in the Supermarket",
    videoId: "MZJt56z5Ywc",
    listeningNote: "Wobbly, homemade post-punk that Kurt Cobain spent years chasing.",
    hostScript:
      "This one is for the heads. The Raincoats sound like the band is being assembled in real time, and that's the magic. That violin sawing against the beat, that refusal to lock into anything slick. Kurt Cobain loved this record so much he wrote about hunting down a copy. Imperfection as a political position.",
    artistContext:
      "A London post-punk group whose self-titled debut became a quiet north star for indie and grunge musicians decades later.",
    roots: [punkSceneRoots[2], danceShift[1]],
    branches: [rebelGirlBranches[1]],
  }),
  track({
    position: 4,
    artist: "Bikini Kill",
    title: "Rebel Girl",
    videoId: "L0oeqAQ1qE8",
    listeningNote: "The anthem. The thesis. Girls to the front.",
    hostScript:
      "Here's the center of gravity. Olympia, Washington, early nineties. Kathleen Hanna isn't just singing about the coolest girl in the neighborhood, she's building a movement with a chorus. Bikini Kill played shows where Hanna told the men to step back and let the women come forward. The song and that instruction are the same gesture. This is riot grrrl in three minutes.",
    artistContext:
      "The band most synonymous with riot grrrl, who paired confrontational live shows with a zine-driven, self-organized feminist punk network.",
    roots: rebelGirlRoots,
    branches: rebelGirlBranches,
  }),
  track({
    position: 5,
    artist: "Sleater-Kinney",
    title: "Dig Me Out",
    videoId: "pVp6A0Ufots",
    listeningNote: "Two guitars, no bass, arguing at full volume.",
    hostScript:
      "After the movement comes the craft. No bass player here, just two guitars locked in a knife fight and Corin Tucker's vibrato cutting through everything. Sleater-Kinney took the riot grrrl urgency and turned it into one of the great rock bands of the era, full stop. This is what happens when the politics and the playing both level up.",
    artistContext:
      "Corin Tucker, Carrie Brownstein, and Janet Weiss built a fierce, interlocking guitar sound out of the same Pacific Northwest scene as Bikini Kill.",
    roots: [rebelGirlRoots[2], punkSceneRoots[2]],
    branches: [rebelGirlBranches[0], rebelGirlBranches[3]],
  }),
  track({
    position: 6,
    artist: "Le Tigre",
    title: "Deceptacon",
    videoId: "wjNln9mXuTI",
    listeningNote: "Riot grrrl plugs into a drum machine and heads for the dance floor.",
    hostScript:
      "Kathleen Hanna again, a few years later, deciding the revolution should also be danceable. Le Tigre takes the cut-and-paste zine energy and feeds it through samplers and cheap beats. The politics didn't soften, they just learned to move your hips. This is the hinge between the punk basement and the party.",
    artistContext:
      "Kathleen Hanna's post-Bikini Kill group, with Johanna Fateman and JD Samson, who fused feminist and queer politics with electro and dance-punk.",
    roots: [rebelGirlRoots[3], rebelGirlRoots[4], danceShift[0]],
    branches: [rebelGirlBranches[2]],
  }),
  track({
    position: 7,
    artist: "Yeah Yeah Yeahs",
    title: "Maps",
    videoId: "oIIxlgcuQRU",
    listeningNote: "Dance-punk swagger cracking open into something tender.",
    hostScript:
      "Now downtown New York, the dance-punk years. Karen O could scream and prowl with anyone, but Maps is her standing completely still. That guitar shimmer, that one held note. Wait, they don't love you like I love you. It's proof the lineage we're tracing wasn't only about volume. It was always about taking up space, including the quiet kind.",
    artistContext:
      "Karen O, Nick Zinner, and Brian Chase emerged from the early-2000s New York scene, balancing art-punk chaos with sudden, disarming vulnerability.",
    roots: [danceShift[0], danceShift[1], rebelGirlRoots[0]],
    branches: [rebelGirlBranches[3]],
  }),
  track({
    position: 8,
    artist: "Sleater-Kinney",
    title: "Modern Girl",
    videoId: "Ptk7DEYY6LA",
    listeningNote: "A deceptively sweet closer with a knife in its pocket.",
    hostScript:
      "We close soft and a little bitter. A bright melody, a harmonica, and lyrics about hunger and TV and being told your problems are small. It's the whole night in miniature: a hook you'll hum, carrying a message you can't quite shake off. That's the trick these women perfected. Make it catchy, then make it count.",
    artistContext:
      "From The Woods, a later Sleater-Kinney song that wraps social fatigue inside one of their most immediate melodies.",
    roots: [rebelGirlRoots[2], rebelGirlRoots[3]],
    branches: [rebelGirlBranches[3]],
  }),
];

export const girlsToTheFrontEpisode: Episode = {
  id: "girls-to-the-front",
  slug: "girls-to-the-front",
  title: "Girls to the Front: Punk, Post-Punk, and Riot Grrrl Rewired",
  description:
    "A guided tour through the women and queer artists who rewired punk, post-punk, riot grrrl, and dance-punk, and the noise they made on purpose, from X-Ray Spex to the Yeah Yeah Yeahs.",
  prompt: PROMPT,
  hostPersona:
    "Late night college radio DJ with a zine collection. Political, warm, specific, and allergic to clichés.",
  visualTheme: themes.punk,
  tracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(tracks.map((t) => t.videoId)),
  createdAt: "2026-01-02T00:00:00.000Z",
};

import type { Episode, MusicConnection, Track } from "@/types/rootnote";
import { themes } from "@/lib/themes";
import { makeYouTubeQueueUrl } from "@/lib/youtube";
import { track } from "@/lib/episodes/helpers";

const PROMPT =
  "Make me a guided radio episode where famous songs are traced backward to the samples, source records, and scenes hiding inside them.";

const strongerRoots: MusicConnection[] = [
  {
    id: "daft-punk-hbfs",
    name: "Daft Punk — Harder, Better, Faster, Stronger",
    type: "sampled",
    confidence: "confirmed",
    explanation:
      "Kanye built the whole track around the vocoder hook from Daft Punk's 2001 single, licensing it openly and even putting the duo in the video. The robot voice is the entire foundation.",
  },
  {
    id: "edwin-birdsong",
    name: "Edwin Birdsong — Cola Bottle Baby",
    type: "sampled",
    confidence: "confirmed",
    explanation:
      "Go one layer deeper: Daft Punk's hook itself samples a 1979 Edwin Birdsong funk record. Stronger is a sample of a sample, a Russian doll of Black American music.",
  },
  {
    id: "french-touch",
    name: "French touch and filter house",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "By reaching for Daft Punk, Kanye pulled French house into mainstream American rap, blurring the line between the rap chart and the dance floor.",
  },
  {
    id: "chipmunk-soul",
    name: "Chipmunk soul",
    type: "uses_technique",
    confidence: "likely",
    explanation:
      "Kanye made his name speeding up soul vocals into helium hooks. Here he applies that same instinct to a robot voice, treating any recording as raw material to flip.",
  },
];

const strongerBranches: MusicConnection[] = [
  {
    id: "edm-rap-fusion",
    name: "The EDM–rap fusion",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "A hip hop superstar openly building on electronic dance music helped kick off years of rap and EDM bleeding into each other on the pop charts.",
  },
  {
    id: "sample-clearance-era",
    name: "The big-budget clearance era",
    type: "branches_into",
    confidence: "scene_connection",
    explanation:
      "Stronger is sampling done in the open, fully licensed and expensive, a long way from the lawless early days. It models how a megahit clears its sources legally.",
  },
];

const gThangRoots: MusicConnection[] = [
  {
    id: "leon-haywood",
    name: "Leon Haywood — I Want'a Do Something Freaky to You",
    type: "sampled",
    confidence: "confirmed",
    explanation:
      "That slow, sunlit groove is lifted from Leon Haywood's 1975 record. Dre slows it down, stretches it out, and lets it roll like a car with the windows down.",
  },
  {
    id: "p-funk-dna",
    name: "P-Funk (Parliament-Funkadelic)",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "G-funk is essentially George Clinton's universe reassembled: high synth whines, fat low end, and a relaxed, rubbery swing borrowed from seventies funk.",
  },
  {
    id: "interpolation-technique",
    name: "Replaying instead of sampling",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Dre often had musicians replay parts rather than lift the tape directly, a cleaner, smoother West Coast approach that became the signature of the G-funk sound.",
  },
];

const gThangBranches: MusicConnection[] = [
  {
    id: "g-funk-era",
    name: "The G-funk era",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "This single basically launches a whole West Coast sound and aesthetic that dominates mid-nineties rap and radio.",
  },
  {
    id: "west-coast-pop",
    name: "Later West Coast pop-rap",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "The melodic, sunny, sample-warm template echoes forward into decades of California hits.",
  },
];

const breakbeatRoots: MusicConnection[] = [
  {
    id: "the-break",
    name: "The drum break",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Hip hop is built on the break: that few seconds of pure drums DJs looped to keep dancers moving. Sampling is the recorded descendant of that one trick.",
  },
  {
    id: "crate-digging",
    name: "Crate digging",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Producers hunted dusty records for the perfect unknown loop. The deeper and more obscure the dig, the more respect, which turned record stores into laboratories.",
  },
];

const tracks: Track[] = [
  track({
    position: 1,
    artist: "The Sugarhill Gang",
    title: "Rapper's Delight",
    videoId: "mcCK99wHrk0",
    listeningNote: "Source: Chic — 'Good Times' (the bassline that started the chart).",
    hostScript:
      "We start at the beginning. That bassline you're bobbing to? It's Chic's Good Times, replayed by a studio band so the first rap hit could ride a disco smash. Nile Rodgers heard it, recognized his own song, and lawyers got involved. Lesson one of this whole episode: hip hop was built by borrowing, and the borrowing started the moment the music did.",
    artistContext:
      "The first rap single to reach a wide audience, built on a replayed version of Chic's 'Good Times.'",
    roots: [
      {
        id: "chic-good-times",
        name: "Chic — Good Times",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The instantly recognizable bassline is Bernard Edwards' line from Chic's 'Good Times,' replayed for the record and later credited after a dispute.",
      },
      breakbeatRoots[0],
      breakbeatRoots[1],
    ],
    branches: [
      {
        id: "sampling-as-foundation",
        name: "Sampling as hip hop's foundation",
        type: "branches_into",
        confidence: "confirmed",
        explanation:
          "Reusing a disco groove to launch rap set the pattern for the entire genre: the new record stands on the shoulders of an old one.",
      },
    ],
  }),
  track({
    position: 2,
    artist: "MC Hammer",
    title: "U Can't Touch This",
    videoId: "otCpCn0l4Wo",
    listeningNote: "Source: Rick James — 'Super Freak' (so direct it rewrote the rules).",
    hostScript:
      "Now an obvious one, on purpose. Hammer doesn't hide the Super Freak hook, he rides it for the entire song. Rick James sued and ended up with a co-writing credit and a Grammy out of it. This case is part of why clearing samples up front became standard practice. Sometimes the source isn't buried at all. Sometimes it's the whole point.",
    artistContext:
      "A massive crossover hit built directly on Rick James' 'Super Freak,' whose legal aftermath helped formalize sample clearance.",
    roots: [
      {
        id: "rick-james-superfreak",
        name: "Rick James — Super Freak",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The bassline and hook are lifted wholesale from 'Super Freak.' James sued, won a co-writing credit, and the track became a textbook clearance story.",
      },
      breakbeatRoots[1],
    ],
    branches: [strongerBranches[1]],
  }),
  track({
    position: 3,
    artist: "The Notorious B.I.G.",
    title: "Juicy",
    videoId: "_JZom_gVfuw",
    listeningNote: "Source: Mtume — 'Juicy Fruit' (a love song flipped into a memoir).",
    hostScript:
      "Here's how a sample can change meaning. Mtume's Juicy Fruit was a slinky eighties slow jam. Pull it under Biggie's voice and suddenly it's the soundtrack to a rags-to-riches life story. Same notes, brand new emotion. The art of the sample isn't just theft, it's translation. You take something familiar and make it carry a story it was never written for.",
    artistContext:
      "Biggie's origin-story anthem reframes Mtume's silky 'Juicy Fruit' as the backdrop to a Brooklyn success myth.",
    roots: [
      {
        id: "mtume-juicy-fruit",
        name: "Mtume — Juicy Fruit",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The melody and groove come from Mtume's 1983 R&B hit 'Juicy Fruit,' recontextualized as a triumphant autobiography.",
      },
      breakbeatRoots[1],
    ],
    branches: [
      {
        id: "sample-as-storytelling",
        name: "Sampling as storytelling",
        type: "branches_into",
        confidence: "likely",
        explanation:
          "Choosing a recognizable old record to underline a personal narrative becomes a core technique of golden-age rap.",
      },
    ],
  }),
  track({
    position: 4,
    artist: "A Tribe Called Quest",
    title: "Can I Kick It?",
    videoId: "O3pyCGnZzYA",
    listeningNote: "Source: Lou Reed — 'Walk on the Wild Side' (all the royalties went uptown).",
    hostScript:
      "That walking bassline is Lou Reed, Walk on the Wild Side, straight off a Velvet Underground alum's solo record. The story goes Reed demanded every cent of the royalties, and got them. It's a perfect snapshot of crate-digging: pulling a downtown art-rock record into a Queens jazz-rap classic, and discovering that the cooler the sample, the steeper the bill.",
    artistContext:
      "A jazz-rap landmark from the Native Tongues collective, built on Lou Reed's 'Walk on the Wild Side' bassline.",
    roots: [
      {
        id: "lou-reed-wild-side",
        name: "Lou Reed — Walk on the Wild Side",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The bassline is sampled directly from Lou Reed's 1972 song; Reed reportedly took the full songwriting royalty.",
      },
      breakbeatRoots[0],
      breakbeatRoots[1],
    ],
    branches: [
      {
        id: "native-tongues-branch",
        name: "Native Tongues and alternative rap",
        type: "branches_into",
        confidence: "scene_connection",
        explanation:
          "The eclectic, jazz-literate, dig-anywhere approach defines a whole lane of bohemian, sample-rich hip hop.",
      },
    ],
  }),
  track({
    position: 5,
    artist: "Kanye West",
    title: "Stronger",
    videoId: "PsO6ZnUZI0g",
    listeningNote: "Source: Daft Punk — 'Harder, Better, Faster, Stronger' (a sample of a sample).",
    hostScript:
      "Our anchor, because it's a sample inside a sample inside a sample. Kanye flips Daft Punk's robot hook. But Daft Punk had themselves chopped a 1979 Edwin Birdsong funk record to make it. So when you nod to Stronger, you're nodding to a French duo nodding to a Harlem funk musician. This is the whole family tree of the genre folded into one hook. Trace any record far enough and you find another record.",
    artistContext:
      "Kanye built 'Stronger' around Daft Punk's vocoder hook, which itself samples Edwin Birdsong, making it a multi-layered lesson in lineage.",
    roots: strongerRoots,
    branches: strongerBranches,
  }),
  track({
    position: 6,
    artist: "Beyoncé",
    title: "Crazy in Love",
    videoId: "ViwtNLUqkMY",
    listeningNote: "Source: The Chi-Lites — 'Are You My Woman? (Tell Me So).'",
    hostScript:
      "Those horns that announce the whole song, the uh-oh, uh-oh energy, that's lifted from a 1970 Chi-Lites record. Producer Rich Harrison had the loop sitting around for years before Beyoncé heard it and built a debut-defining smash on it in a single session. A forgotten soul horn line, waiting in a crate, becomes one of the most recognizable intros of the century.",
    artistContext:
      "Beyoncé's breakout solo single is powered by a horn loop from The Chi-Lites' 'Are You My Woman?'",
    roots: [
      {
        id: "chi-lites-woman",
        name: "The Chi-Lites — Are You My Woman? (Tell Me So)",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The signature horn fanfare is sampled from the Chi-Lites' 1970 soul record, recontextualized into a modern pop juggernaut.",
      },
      breakbeatRoots[1],
    ],
    branches: [strongerBranches[0]],
  }),
  track({
    position: 7,
    artist: "Dr. Dre",
    title: "Nuthin' but a 'G' Thang",
    videoId: "8GliyDgAGQI",
    listeningNote: "Source: Leon Haywood — 'I Want'a Do Something Freaky to You.'",
    hostScript:
      "West Coast time. Dre takes a 1975 Leon Haywood groove, slows it down, and lets it bake in the California sun. Notice how clean it sounds, because Dre liked to have players re-perform the parts rather than just lift the tape. That smoothness is the birth of G-funk: P-funk genes, a Haywood spine, and a whole new template for what the radio sounded like for years.",
    artistContext:
      "The single that defined G-funk, reworking Leon Haywood's seventies groove into a polished West Coast sound.",
    roots: gThangRoots,
    branches: gThangBranches,
  }),
  track({
    position: 8,
    artist: "Eminem",
    title: "My Name Is",
    videoId: "sNPnbI1arSE",
    listeningNote: "Source: Labi Siffre — 'I Got The...' (a protest record under a joke).",
    hostScript:
      "We close with a hidden message. The loop under Eminem's breakout is from Labi Siffre, a Black, openly gay British singer-songwriter whose original was, in part, about defiance against oppression. Siffre reportedly only cleared it after some lyrics were changed. So under one of the most cartoonish hits of the nineties sits a quietly serious record. That's the gift of tracing samples: every song is a trapdoor into another one.",
    artistContext:
      "Eminem's first big hit is built on Labi Siffre's 'I Got The...,' whose composer pushed back on the original lyrics before clearing it.",
    roots: [
      {
        id: "labi-siffre",
        name: "Labi Siffre — I Got The...",
        type: "sampled",
        confidence: "confirmed",
        explanation:
          "The bass-and-keys loop is sampled from Labi Siffre's 1975 track; Siffre, an openly gay Black artist, reportedly required lyric changes before approving the sample.",
      },
      breakbeatRoots[1],
    ],
    branches: [
      {
        id: "sample-as-trapdoor",
        name: "Every song as a trapdoor",
        type: "branches_into",
        confidence: "ai_inferred",
        explanation:
          "Following a sample backward keeps revealing the social and musical history hidden inside a familiar hit.",
      },
    ],
  }),
];

export const whereSampleCameFromEpisode: Episode = {
  id: "where-sample-came-from",
  slug: "where-sample-came-from",
  title: "Where That Sample Came From",
  description:
    "Famous songs traced backward to the samples, source records, and scenes hiding inside them, from a replayed Chic bassline to a sample buried three records deep.",
  prompt: PROMPT,
  hostPersona:
    "Late night college radio DJ playing detective, following every record back to the one it was hiding.",
  visualTheme: themes.hiphop,
  tracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(tracks.map((t) => t.videoId)),
  createdAt: "2026-01-05T00:00:00.000Z",
};

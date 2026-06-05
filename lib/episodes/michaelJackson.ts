import type {
  DeepDiveContent,
  Episode,
  MusicConnection,
  Track,
} from "@/types/rootnote";
import { themes } from "@/lib/themes";
import { makeYouTubeQueueUrl } from "@/lib/youtube";
import { track } from "@/lib/episodes/helpers";

const PROMPT =
  "Make me a guided radio episode about Michael Jackson, from Gary Indiana and the Jackson 5 through Off the Wall, Thriller, and Bad, the family business, and the controversies and legal chapters that shaped his life, told as music history.";

const billieJeanRoots: MusicConnection[] = [
  {
    id: "motown-training",
    name: "The Motown hit factory",
    type: "influenced_by",
    confidence: "confirmed",
    explanation:
      "Michael learned songcraft as a child inside Motown's assembly line: tight arrangements, undeniable hooks, and the discipline of making every second of a single count.",
  },
  {
    id: "quincy-jones",
    name: "Quincy Jones' production",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Quincy framed Michael's voice with jazz sophistication and studio precision, sculpting space around that bassline so the groove feels both minimal and enormous.",
  },
  {
    id: "disco-postdisco",
    name: "Disco and post-disco funk",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Coming out of the disco era, the four-on-the-floor pulse gets leaner and harder here, pointing toward the slick dance-pop of the eighties.",
  },
  {
    id: "the-groove-bassline",
    name: "The defining bassline",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "That hypnotic, repeating bass figure is the entire song's engine. Michael reportedly fought to keep its long intro because, in his words, it made him want to dance.",
  },
];

const billieJeanBranches: MusicConnection[] = [
  {
    id: "mtv-color-line",
    name: "MTV and the color line",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "The video's success helped pressure MTV into regularly playing Black artists, reshaping who got seen on the most powerful music platform of the decade.",
  },
  {
    id: "modern-pop-blueprint",
    name: "The modern pop blueprint",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "The total package of singer, dancer, and short-film auteur becomes the template every global pop star is measured against afterward.",
  },
  {
    id: "moonwalk-branch",
    name: "The moonwalk moment",
    type: "branches_into",
    confidence: "scene_connection",
    explanation:
      "Debuted with this song at Motown 25, the move turned Michael into a worldwide phenomenon overnight and made dance central to pop stardom.",
  },
];

const dontStopRoots: MusicConnection[] = [
  {
    id: "j5-motown",
    name: "The Jackson 5 and Motown",
    type: "influenced_by",
    confidence: "confirmed",
    explanation:
      "Michael's solo voice carries everything he absorbed as a child star: phrasing, showmanship, and an instinct for the hook learned on the road since elementary-school age.",
  },
  {
    id: "philly-soul",
    name: "Philadelphia soul and disco strings",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "Lush strings and a buoyant rhythm section connect Off the Wall to the orchestrated dance music of seventies Philadelphia.",
  },
  {
    id: "michael-songwriting",
    name: "Michael as songwriter",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "This was the song that proved Michael could write his own smash, a turning point from interpreter to author and the start of his creative independence.",
  },
];

const familyBusiness: MusicConnection[] = [
  {
    id: "joe-jackson-mgmt",
    name: "Joe Jackson and the family machine",
    type: "same_scene",
    confidence: "confirmed",
    explanation:
      "Patriarch Joe Jackson drilled the brothers relentlessly and ran the act as a business. The Jackson family operation is inseparable from how the music was made and sold.",
  },
  {
    id: "motown-to-epic",
    name: "Leaving Motown for Epic",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Striking out from Motown to Epic Records gave the brothers, and especially Michael, the room to write and produce their own material and control their sound.",
  },
];

const legalChapters: MusicConnection = {
  id: "mj-later-legal",
  name: "The later legal chapters",
  type: "branches_into",
  confidence: "confirmed",
  explanation:
    "Michael's later life was shadowed by abuse allegations he always denied. In 1993 he settled a civil suit out of court; in the 2005 People v. Jackson trial he was acquitted on all counts. The history is contested and best stated plainly. Open the deep dive for the documented facts.",
};

const mjDeepDive: Record<string, DeepDiveContent> = {
  "the later legal chapters": {
    title: "The later legal chapters",
    summary:
      "From roughly 1993 onward, Michael Jackson faced child sexual abuse allegations that he consistently and categorically denied. These chapters are a real and serious part of his story, and they are best handled with documented facts rather than rumor.",
    whyThisMatters:
      "How we remember an artist of this scale is itself cultural history. The allegations reshaped his public image and career, and they remain genuinely contested, so accuracy and care matter more than a verdict-by-vibes.",
    context:
      "1993: 13-year-old Jordan Chandler accused Jackson of abuse. Jackson denied it; a civil suit was settled out of court in January 1994 for a reported sum (widely cited around $23 million), explicitly without an admission of guilt and, per later court filings, negotiated by his insurance carrier. Two grand juries declined to indict at the time. 2003–2005: Jackson was charged in connection with Gavin Arvizo; in the 2005 trial People v. Jackson in Santa Maria, California, a jury acquitted him on all fourteen counts on June 13, 2005. After his death in 2009, further allegations and lawsuits were filed by others, which his estate has continued to dispute. Allegations are stated here as allegations; the court outcomes are stated as facts.",
  },
};

const tracks: Track[] = [
  track({
    position: 1,
    artist: "The Jackson 5",
    title: "I Want You Back",
    videoId: "UvynvnxZJ3Q",
    listeningNote: "Gary, Indiana to Motown in one perfect three-minute burst.",
    hostScript:
      "We begin in Gary, Indiana, a steel town, with a family act drilled to perfection by their father Joe. This is the Jackson 5's Motown arrival, and that's a ten- or eleven-year-old Michael out front sounding like he's been doing this for forty years. Listen to the joy and the precision sitting side by side. The whole story is already here: extraordinary talent and an extraordinary amount of work behind it.",
    artistContext:
      "The Jackson 5's breakthrough Motown single, with a preteen Michael as a once-in-a-generation child lead.",
    roots: [dontStopRoots[0], familyBusiness[0]],
    branches: [dontStopRoots[2], familyBusiness[1]],
  }),
  track({
    position: 2,
    artist: "The Jackson 5",
    title: "ABC",
    videoId: "ISqzbbZVIiU",
    listeningNote: "The Motown machine doing what it did best: pure, drilled joy.",
    hostScript:
      "The follow-up, and you can hear the factory at work, in the best sense. Motown built songs like watches, and the Jacksons were the perfect vehicle. But behind the bubblegum brightness was a punishing schedule and a father running the act like a drill sergeant. That tension, sunshine on the record, pressure behind it, never really leaves Michael's life.",
    artistContext:
      "A second number-one hit that cemented the Jackson 5 as Motown's brightest new act.",
    roots: [dontStopRoots[0], familyBusiness[0]],
    branches: [familyBusiness[1]],
  }),
  track({
    position: 3,
    artist: "The Jackson 5",
    title: "I'll Be There",
    videoId: "PmeLxaBNrAI",
    listeningNote: "The ballad that proved he was more than a novelty.",
    hostScript:
      "This is the one that told everyone the kid was no gimmick. A tender, grown-up ballad, sung by a child with impossible control and real feeling. It became one of Motown's biggest hits ever. You're hearing the moment Michael stops being the cute little brother and starts becoming the artist the whole world will eventually orbit.",
    artistContext:
      "A landmark Motown ballad showcasing Michael's emotional range far beyond his years.",
    roots: [dontStopRoots[0], billieJeanRoots[0]],
    branches: [familyBusiness[1]],
  }),
  track({
    position: 4,
    artist: "The Jacksons",
    title: "Shake Your Body (Down to the Ground)",
    videoId: "-qBqHnevIn4",
    listeningNote: "The family takes the controls: writing and producing their own hit.",
    hostScript:
      "Now the family business pivots. They've left Motown for Epic, changed the name to the Jacksons because Motown owned the old one, and crucially, they're writing and producing themselves. Michael co-wrote this. It's the sound of an artist discovering he can run the board, not just stand at the mic. The independence he finds here is the runway for everything solo that follows.",
    artistContext:
      "A self-written, self-produced disco-funk hit from the brothers' post-Motown years on Epic, marking their creative independence.",
    roots: [familyBusiness[1], dontStopRoots[1]],
    branches: [dontStopRoots[2]],
  }),
  track({
    position: 5,
    artist: "Michael Jackson",
    title: "Don't Stop 'Til You Get Enough",
    videoId: "yURRmWtbTbo",
    listeningNote: "Off the Wall: the first true Michael Jackson masterpiece.",
    hostScript:
      "Our first anchor. 1979, Off the Wall, Michael teamed with Quincy Jones, and the adult superstar arrives fully formed. He wrote this one himself, and you can feel the exhilaration of a guy who finally has full creative control, that giddy falsetto, those strings, that bassline. This is the sound of someone realizing there's no ceiling. And there almost wasn't.",
    artistContext:
      "Michael's first solo blockbuster with Quincy Jones, a self-penned disco-funk landmark that opened the Off the Wall era.",
    roots: dontStopRoots,
    branches: [billieJeanBranches[1], dontStopRoots[2]],
  }),
  track({
    position: 6,
    artist: "Michael Jackson",
    title: "Billie Jean",
    videoId: "Zi_XLOBDo_Y",
    listeningNote: "Thriller's dark heart and the night he conquered the planet.",
    hostScript:
      "The second anchor, and maybe the most important four minutes in pop. That bassline, that paranoid lyric, that restraint. Michael fought to keep the long intro because it made him want to move. He debuted the moonwalk to this at Motown 25, and the video helped break MTV's unofficial color line. Thriller becomes the best-selling album in history. From here, he isn't a star, he's a phenomenon, with everything that does to a person.",
    artistContext:
      "The centerpiece of Thriller, whose song, video, and Motown 25 performance made Michael the biggest star on earth.",
    roots: billieJeanRoots,
    branches: billieJeanBranches,
  }),
  track({
    position: 7,
    artist: "Michael Jackson",
    title: "Beat It",
    videoId: "oRdxUFDoQe0",
    listeningNote: "Pop and rock fused, with an Eddie Van Halen solo for the bridge.",
    hostScript:
      "Still on Thriller, and here's Michael the strategist. He brings in Eddie Van Halen to shred a solo, deliberately fusing rock and pop and Black and white radio formats into one record. It's a peace treaty and a power move at once. He wasn't just making hits, he was redrawing the map of who pop belonged to. Few artists have ever been that deliberate about breaking down walls.",
    artistContext:
      "A genre-fusing Thriller single featuring Eddie Van Halen, engineered to cross rock and pop audiences.",
    roots: [billieJeanRoots[1], billieJeanRoots[2]],
    branches: [billieJeanBranches[0], billieJeanBranches[1]],
  }),
  track({
    position: 8,
    artist: "Michael Jackson",
    title: "Smooth Criminal",
    videoId: "h_D3VFfhvs4",
    listeningNote: "The Bad era: total control, the anti-gravity lean, peak showman.",
    hostScript:
      "The Bad era, and Michael is now a one-man genre. Everything is tighter, harder, more cinematic, and the choreography becomes its own special effect, that impossible forward lean. He's at the absolute summit of his powers and his fame. But this is also roughly where the press coverage starts to tilt from the music toward the man, and the next part of the story gets harder to tell.",
    artistContext:
      "A peak-era Bad single defined by its cinematic video and the gravity-defying lean, capturing Michael at his showman height.",
    roots: [billieJeanRoots[1], billieJeanRoots[3]],
    branches: [billieJeanBranches[2]],
  }),
  track({
    position: 9,
    artist: "Michael Jackson",
    title: "Black or White",
    videoId: "pTFE8cirkdQ",
    listeningNote: "A massive nineties hit, and the threshold of the harder chapters.",
    hostScript:
      "We close on Black or White, a giant 1991 single about unity that became the doorway into Michael's most complicated decade. From here, the headlines shift. Starting in 1993 he faced abuse allegations, which he always denied. He settled a civil case out of court in 1994, and in the 2005 trial People versus Jackson, a jury acquitted him on all counts. These chapters are real, serious, and genuinely contested, and the honest move is to state the documented facts plainly rather than play judge. Hit the deep dive on the later legal chapters if you want the timeline laid out. For tonight, we hold the whole picture: a once-in-a-century talent, a complicated and contested life, and a body of music that changed what pop could be.",
    artistContext:
      "A blockbuster Dangerous-era single whose era also marks the start of the contested legal chapters of Michael's later life.",
    roots: [billieJeanRoots[1], billieJeanBranches[1]],
    branches: [billieJeanBranches[1], legalChapters],
  }),
];

export const michaelJacksonEpisode: Episode = {
  id: "michael-jackson",
  slug: "michael-jackson",
  title: "Michael Jackson: Gary to the Mirrorball, and Everything After",
  description:
    "The full arc of Michael Jackson as music history: Gary, Indiana and the Motown Jackson 5, the Jackson family business, the solo ascent through Off the Wall, Thriller, and Bad, and the contested legal chapters of his later life, stated with documented facts.",
  prompt: PROMPT,
  hostPersona:
    "Late night college radio DJ who reveres the music and refuses to flatten a complicated life. Specific, warm, careful with hard facts.",
  visualTheme: themes.disco,
  tracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(tracks.map((t) => t.videoId)),
  createdAt: "2026-01-06T00:00:00.000Z",
};

export const michaelJacksonDeepDives = mjDeepDive;

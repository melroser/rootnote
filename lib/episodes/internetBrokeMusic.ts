import type { Episode, MusicConnection, Track } from "@/types/rootnote";
import { themes } from "@/lib/themes";
import { makeYouTubeQueueUrl } from "@/lib/youtube";
import { track } from "@/lib/episodes/helpers";

const PROMPT =
  "Make me a radio episode about how MySpace, LimeWire, YouTube, SoundCloud, TikTok, and Discord changed what music sounds like.";

const crankThatRoots: MusicConnection[] = [
  {
    id: "fl-studio-bedroom",
    name: "FL Studio bedroom production",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Soulja Boy built the beat himself on cracked, cheap software at home. The whole record is proof that the means of production had quietly moved into teenagers' bedrooms.",
  },
  {
    id: "ringtone-economy",
    name: "The ringtone economy",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Before streaming, the master ringtone was a real chart force. A song's job was to sound great as a ten-second loop coming out of a flip phone, which rewarded immediacy over depth.",
  },
  {
    id: "myspace-distribution",
    name: "MySpace and free uploads",
    type: "influenced_by",
    confidence: "likely",
    explanation:
      "The pre-history here is MySpace: the radical idea that you could upload your own song to your own page and let it spread without a label deciding first.",
  },
  {
    id: "youtube-tutorial",
    name: "The YouTube dance tutorial",
    type: "uses_technique",
    confidence: "confirmed",
    explanation:
      "Soulja Boy posted instructions for the dance itself. The song came bundled with a participation manual, turning every viewer into a potential promoter.",
  },
];

const crankThatBranches: MusicConnection[] = [
  {
    id: "tiktok-dance-economy",
    name: "The TikTok dance economy",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Bundling a song with a learnable dance becomes the dominant pop strategy a decade later. Crank That is the prototype for how a hook plus choreography conquers a platform.",
  },
  {
    id: "soundcloud-rap",
    name: "SoundCloud rap and DIY uploads",
    type: "branches_into",
    confidence: "likely",
    explanation:
      "The self-made, upload-it-yourself, skip-the-gatekeeper model runs straight into the next wave of artists who broke entirely through free hosting platforms.",
  },
  {
    id: "meme-as-marketing",
    name: "The meme as marketing",
    type: "branches_into",
    confidence: "confirmed",
    explanation:
      "Once a song is also a meme, distribution becomes free and exponential. That collapse of the line between joke, dance, and single defines modern virality.",
  },
];

const myspaceRoots: MusicConnection[] = [
  crankThatRoots[2],
  {
    id: "filesharing-culture",
    name: "File-sharing culture",
    type: "same_scene",
    confidence: "scene_connection",
    explanation:
      "Napster and LimeWire trained a generation to expect access to everything, instantly and free, which permanently changed what music had to compete against: all other music, at once.",
  },
];

const platformBranches: MusicConnection[] = [
  crankThatBranches[0],
  crankThatBranches[2],
];

const tracks: Track[] = [
  track({
    position: 1,
    artist: "Arctic Monkeys",
    title: "I Bet You Look Good on the Dancefloor",
    videoId: "pK7egZaT3hs",
    listeningNote: "The first great MySpace band, before MySpace knew it.",
    hostScript:
      "We open in 2005 with the band that became the cautionary tale labels still tell. Arctic Monkeys gave out demos at shows, fans uploaded them, and the songs spread across MySpace pages before any record company had a say. By the time the suits showed up, the kids had already decided. The gatekeepers had been quietly fired.",
    artistContext:
      "Sheffield teenagers whose grassroots, fan-driven online spread became the template story for the social-media era of breaking a band.",
    roots: myspaceRoots,
    branches: [crankThatBranches[1]],
  }),
  track({
    position: 2,
    artist: "OK Go",
    title: "Here It Goes Again",
    videoId: "dTAAsCNK7RA",
    listeningNote: "The treadmill video that taught bands the clip was the song.",
    hostScript:
      "2006, and a band figures out that on YouTube the video might matter more than the radio. Four guys, eight treadmills, one take. It exploded because it begged to be shared. OK Go basically discovered the new physics: the most watchable thing wins, and watchability is now part of songwriting whether you like it or not.",
    artistContext:
      "The band that turned the low-budget, high-concept YouTube music video into a viral artform and a distribution strategy.",
    roots: [crankThatRoots[2], myspaceRoots[1]],
    branches: [crankThatBranches[2]],
  }),
  track({
    position: 3,
    artist: "Soulja Boy Tell'em",
    title: "Crank That (Soulja Boy)",
    videoId: "8UFIYGkROII",
    listeningNote: "The blueprint: bedroom beat, free upload, bundled dance.",
    hostScript:
      "Here's the Rosetta Stone for everything that follows. A teenager makes the beat himself on cheap software, uploads it free, films the dance, and posts the instructions. Song, choreography, and marketing arrive as one object. People argued about whether it was even music. They were missing it. This was a new operating system for how a hit happens.",
    artistContext:
      "A self-produced, self-distributed phenomenon that fused bedroom production, the ringtone economy, and the participatory YouTube dance into one viral package.",
    roots: crankThatRoots,
    branches: crankThatBranches,
  }),
  track({
    position: 4,
    artist: "PSY",
    title: "Gangnam Style",
    videoId: "9bZkp7q19f0",
    listeningNote: "The day the global counter broke.",
    hostScript:
      "2012. A Korean pop satire becomes the first video to hit a billion views, and YouTube literally has to upgrade its view counter to hold the number. No American radio plan, no traditional rollout, just the whole planet sharing the same horse dance. This is the moment it becomes undeniable that the internet, not any one country's industry, is now the main stage.",
    artistContext:
      "PSY's worldwide smash proved a non-English, internet-native hit could outscale anything the legacy music industry had built.",
    roots: [crankThatRoots[3], crankThatBranches[2]],
    branches: [crankThatBranches[0]],
  }),
  track({
    position: 5,
    artist: "Post Malone",
    title: "White Iverson",
    videoId: "SLsTskih7_I",
    listeningNote: "A SoundCloud upload that became a career.",
    hostScript:
      "Now the SoundCloud years. Post Malone records this, throws it up online, and it racks up millions of plays before the industry has a contract ready. Hear how blurry the genre is, rap, melody, country sadness, all smeared together. That blur is a SoundCloud trait: when there are no shelves, nobody has to pick a section to stand in.",
    artistContext:
      "An early example of the SoundCloud-to-superstar path, where a single self-uploaded track outran the traditional A&R timeline.",
    roots: [crankThatRoots[0], crankThatBranches[1]],
    branches: [crankThatBranches[1]],
  }),
  track({
    position: 6,
    artist: "Lil Nas X",
    title: "Old Town Road",
    videoId: "r7qovpFAGrQ",
    listeningNote: "A meme, a genre fight, and the longest number one ever.",
    hostScript:
      "2019, and a kid who studied virality like a science buys a beat online, makes a country-trap song, and pushes it through TikTok memes until it can't be stopped. It even gets yanked off the country chart, which only made it bigger. Old Town Road is what happens when someone who grew up native to these platforms decides to game every single one on purpose.",
    artistContext:
      "Lil Nas X engineered a TikTok-fueled, meme-driven rise that exposed how genre and chart rules buckle under internet-scale momentum.",
    roots: [crankThatBranches[0], crankThatBranches[2]],
    branches: platformBranches,
  }),
  track({
    position: 7,
    artist: "Doja Cat",
    title: "Say So",
    videoId: "pok8H_KF1FA",
    listeningNote: "Built, almost retroactively, for a TikTok dance.",
    hostScript:
      "Doja Cat came up making absurdist internet songs, so she understood the assignment perfectly. Say So becomes huge after a teenager's dance goes viral, and the label leans all the way in. By now the loop is closed: the platform doesn't just spread the song, it shapes which fifteen seconds the whole song is built to deliver.",
    artistContext:
      "A fully internet-fluent pop star whose breakthrough was accelerated by a fan-made TikTok dance the industry then amplified.",
    roots: [crankThatBranches[0], crankThatRoots[0]],
    branches: [crankThatBranches[2]],
  }),
  track({
    position: 8,
    artist: "100 gecs",
    title: "money machine",
    videoId: "z97qLNXeAMQ",
    listeningNote: "What music sounds like when it's made by and for the internet itself.",
    hostScript:
      "We end in the deep end. 100 gecs built this between two cities, partly over Discord and shared files, blowing out every rule about what's too loud, too fast, or too annoying. Hyperpop is the sound of growing up inside the feed: maximal, ironic, sincere, all at once. This is the internet not just delivering the music anymore. This is the internet's own native accent.",
    artistContext:
      "A long-distance, internet-built duo whose hyperpop became the sound of online music communities like Discord and the post-genre feed.",
    roots: [myspaceRoots[1], crankThatRoots[0]],
    branches: [crankThatBranches[2]],
  }),
];

export const internetBrokeMusicEpisode: Episode = {
  id: "internet-broke-music",
  slug: "internet-broke-music",
  title: "The Internet Broke Music",
  description:
    "How MySpace, LimeWire, YouTube, SoundCloud, TikTok, and Discord rewired what music sounds like and who gets to make it, from bedroom beats to billion-view counters.",
  prompt: PROMPT,
  hostPersona:
    "Late night college radio DJ who lived through every platform. Curious, a little conspiratorial, never nostalgic for its own sake.",
  visualTheme: themes.electronic,
  tracks,
  youtubeQueueUrl: makeYouTubeQueueUrl(tracks.map((t) => t.videoId)),
  createdAt: "2026-01-03T00:00:00.000Z",
};

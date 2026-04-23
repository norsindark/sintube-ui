import type { Channel, Video, Comment, User } from "@/types";

const PALETTES = [
  ["#ef4444", "#fde68a"],
  ["#3b82f6", "#bae6fd"],
  ["#10b981", "#bbf7d0"],
  ["#a855f7", "#e9d5ff"],
  ["#f97316", "#fed7aa"],
  ["#0ea5e9", "#bae6fd"],
  ["#14b8a6", "#ccfbf1"],
  ["#eab308", "#fef08a"],
  ["#ec4899", "#fbcfe8"],
  ["#6366f1", "#c7d2fe"],
];

export function thumbnailFor(seed: string, label: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const safe = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").slice(0, 40);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'>
    <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <text x='32' y='320' font-family='Inter,sans-serif' font-size='28' font-weight='700' fill='white' opacity='0.95'>${safe}</text>
    <circle cx='560' cy='60' r='28' fill='white' opacity='0.85'/>
    <polygon points='550,46 550,74 578,60' fill='${c1}'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function avatarFor(seed: string, initials: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [c1, c2] = PALETTES[h % PALETTES.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
    <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='80' height='80' rx='40' fill='url(#g)'/>
    <text x='40' y='50' text-anchor='middle' font-family='Inter,sans-serif' font-size='32' font-weight='700' fill='white'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES = [
  "All", "Music", "Gaming", "Live", "News", "Coding",
  "Cooking", "Travel", "Sports", "Comedy", "Tech", "Podcasts",
];

const channelSeeds: Array<Omit<Channel, "avatar">> = [
  { id: "c1", name: "Lo-Fi Atelier", subscribers: 1_240_000, verified: true },
  { id: "c2", name: "Pixel Foundry", subscribers: 845_000, verified: true },
  { id: "c3", name: "The Codex", subscribers: 2_100_000, verified: true },
  { id: "c4", name: "Backroad Kitchen", subscribers: 512_000, verified: false },
  { id: "c5", name: "Quiet Routes", subscribers: 198_000, verified: false },
  { id: "c6", name: "Field Notes", subscribers: 76_400, verified: false },
  { id: "c7", name: "Modern Workshop", subscribers: 1_810_000, verified: true },
  { id: "c8", name: "Night Lab", subscribers: 322_000, verified: false },
];

export const channels: Channel[] = channelSeeds.map((c) => ({
  ...c,
  avatar: avatarFor(c.id, c.name.slice(0, 2).toUpperCase()),
}));

const videoSeeds: Array<{
  title: string; category: string; duration: number; views: number; days: number; channelIdx: number;
}> = [
  { title: "Late night beats to wind down to", category: "Music", duration: 4321, views: 1_200_000, days: 4, channelIdx: 0 },
  { title: "Building a tiny game engine in Rust", category: "Coding", duration: 1832, views: 320_400, days: 2, channelIdx: 2 },
  { title: "I baked sourdough every day for a month", category: "Cooking", duration: 942, views: 88_700, days: 7, channelIdx: 3 },
  { title: "Quiet morning along the Sumida river", category: "Travel", duration: 1267, views: 45_300, days: 11, channelIdx: 4 },
  { title: "How CSS Container Queries actually work", category: "Tech", duration: 712, views: 210_500, days: 1, channelIdx: 2 },
  { title: "Gaming Showcase — best indie games of the season", category: "Gaming", duration: 2511, views: 980_200, days: 3, channelIdx: 1 },
  { title: "Ambient set for focus and deep work", category: "Music", duration: 5400, views: 2_340_000, days: 30, channelIdx: 0 },
  { title: "Designing a paper notebook from scratch", category: "Tech", duration: 1430, views: 64_100, days: 14, channelIdx: 6 },
  { title: "Explaining Pixel Art lighting in 12 minutes", category: "Gaming", duration: 728, views: 156_800, days: 5, channelIdx: 1 },
  { title: "What I eat in a week as a film photographer", category: "Cooking", duration: 612, views: 33_400, days: 9, channelIdx: 5 },
  { title: "Live coding: a markdown editor in 90 minutes", category: "Live", duration: 5230, views: 7_900, days: 0, channelIdx: 2 },
  { title: "The story behind the small bakery on Pike St.", category: "News", duration: 990, views: 412_000, days: 22, channelIdx: 5 },
  { title: "Morning rain in a Kyoto garden", category: "Travel", duration: 1844, views: 1_010_000, days: 60, channelIdx: 4 },
  { title: "How a vinyl press actually works", category: "Tech", duration: 1112, views: 503_200, days: 12, channelIdx: 6 },
  { title: "Stand-up: airline food, again", category: "Comedy", duration: 832, views: 240_900, days: 4, channelIdx: 7 },
  { title: "Building shelves with hand tools only", category: "Tech", duration: 1995, views: 92_300, days: 19, channelIdx: 6 },
  { title: "On the sideline: a quiet Saturday at the field", category: "Sports", duration: 643, views: 18_400, days: 3, channelIdx: 5 },
  { title: "Every typescript trick I wish I knew sooner", category: "Coding", duration: 1543, views: 720_000, days: 6, channelIdx: 2 },
  { title: "Podcast 042 — talking shop with a typeface designer", category: "Podcasts", duration: 4220, views: 28_700, days: 8, channelIdx: 7 },
  { title: "Slow river drone footage, 4K", category: "Travel", duration: 3120, views: 412_500, days: 33, channelIdx: 4 },
  { title: "Live news brief — top stories this hour", category: "News", duration: 480, views: 60_300, days: 0, channelIdx: 5 },
  { title: "Weekend cabin breakfast — eggs three ways", category: "Cooking", duration: 612, views: 121_400, days: 14, channelIdx: 3 },
  { title: "Why we still play the original arcade classics", category: "Gaming", duration: 905, views: 88_100, days: 17, channelIdx: 1 },
  { title: "Ambient guitar loops for late summer evenings", category: "Music", duration: 2880, views: 1_540_000, days: 25, channelIdx: 0 },
];

export const videos: Video[] = videoSeeds.map((v, i) => {
  const id = `v${i + 1}`;
  const channel = channels[v.channelIdx];
  const publishedAt = new Date(Date.now() - v.days * 86400000).toISOString();
  return {
    id,
    title: v.title,
    category: v.category,
    duration: v.duration,
    views: v.views,
    publishedAt,
    description:
      `${v.title}.\n\nThis is a mock video used to demonstrate the YouTube Mini UI clone. ` +
      `It does not stream from a real source. Posted by ${channel.name}.`,
    channel,
    likes: Math.floor(v.views * 0.04),
    thumbnail: thumbnailFor(id, v.title),
    comments: makeComments(id),
  };
});

function makeComments(seed: string): Comment[] {
  const samples = [
    "First! No idea why I'm proud of this.",
    "The pacing on this is so good — never thought I'd finish a 40 minute video on this topic.",
    "Came for the title, stayed for the editing.",
    "Anyone else watching this in 2026?",
    "This deserves way more views.",
  ];
  return samples.map((text, i) => ({
    id: `${seed}-c${i}`,
    text,
    publishedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    likes: Math.floor(Math.random() * 1200),
    user: {
      id: `u${i}`,
      name: ["Mira K.", "Theo R.", "Ava L.", "Noah P.", "Sage M."][i] ?? "Viewer",
      avatar: avatarFor(`comment-${seed}-${i}`, ["MK", "TR", "AL", "NP", "SM"][i] ?? "VW"),
    },
  }));
}

export const sampleVideoSrc =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function makeUserFromEmail(email: string, name?: string): User {
  const base = name ?? email.split("@")[0].replace(/[._-]/g, " ");
  const display = base.replace(/\b\w/g, (m) => m.toUpperCase()) || "Viewer";
  const initials = display.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return {
    id: `me-${email}`,
    name: display,
    email,
    handle: "@" + email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
    avatar: avatarFor(email, initials || "ME"),
    subscribers: 128,
    joinedAt: new Date(Date.now() - 540 * 86400000).toISOString(),
  };
}

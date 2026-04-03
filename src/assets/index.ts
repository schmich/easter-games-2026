// Images
import bunny from "./bunny.webp";
import basket from "./basket.webp";
import grass from "./grass.webp";
import eggsGrass from "./eggs-grass.webp";
import grassBasket from "./grass-basket.webp";
import bugsy from "./bugsy.webp";
import bugsyWin from "./bugsy-win.webp";
import bugsyLose from "./bugsy-lose.webp";
import bugsyEggdleIntro from "./bugsy-eggdle-intro.webp";
import bugsyConneggtionsIntro from "./bugsy-conneggtions-intro.webp";
import bugsyEggdleWinImg from "./bugsy-eggdle-win.webp";
import title from "./title.webp";
import banner from "./banner.webp";

// Audio
import bugsyEggdleWin from "./bugsy-eggdle-win.mp3";
import bugsySwingMiss from "./bugsy-swing-miss.mp3";
import bugsyIntro from "./bugsy-intro.mp3";
import announcerIntro from "./announcer-intro.mp3";
import announcerEggdle from "./announcer-eggdle.mp3";
import announcerConneggtions from "./announcer-conneggtions.mp3";
import bugsyAintItChief from "./bugsy-aint-it-chief.mp3";
import click from "./click.mp3";
import bgMusic1 from "./background-music-1.mp3";
import bgMusic2 from "./background-music-2.mp3";
import bgMusic3 from "./background-music-3.mp3";

export const images = {
  bunny,
  basket,
  grass,
  eggsGrass,
  grassBasket,
  bugsy,
  bugsyWin,
  bugsyLose,
  bugsyEggdleIntro,
  bugsyConneggtionsIntro,
  bugsyEggdleWin: bugsyEggdleWinImg,
  title,
  banner,
} as const;

// Preload all images and audio — returns a promise that resolves when all are loaded
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
    preloadedImages.push(img);
  });
}

function preloadAudio(audioEl: HTMLAudioElement): Promise<void> {
  return new Promise((resolve) => {
    if (audioEl.readyState >= 3) {
      resolve();
      return;
    }
    audioEl.addEventListener("canplaythrough", () => resolve(), { once: true });
    audioEl.addEventListener("error", () => resolve(), { once: true });
  });
}

const preloadedImages: HTMLImageElement[] = [];

export const audio = {
  bugsyEggdleWin: new Audio(bugsyEggdleWin),
  bugsyIntro: new Audio(bugsyIntro),
  announcerIntro: new Audio(announcerIntro),
  announcerEggdle: new Audio(announcerEggdle),
  announcerConneggtions: new Audio(announcerConneggtions),
} as const;

// Background music — shuffled once, then looped in that order
const bgTracks = shuffle([new Audio(bgMusic1), new Audio(bgMusic2), new Audio(bgMusic3)]);
let bgTrackIndex = 0;
let bgStarted = false;

function playNextBgTrack() {
  const track = bgTracks[bgTrackIndex % bgTracks.length];
  track.volume = 0.1;
  track.currentTime = 0;
  track.onended = () => {
    bgTrackIndex++;
    playNextBgTrack();
  };
  track.play();
}

export function startBackgroundMusic() {
  if (bgStarted) return;
  bgStarted = true;
  playNextBgTrack();
}

// Click sound via Web Audio API for reliable rapid playback on mobile
let clickBuffer: AudioBuffer | null = null;
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

fetch(click)
  .then((res) => res.arrayBuffer())
  .then((buf) => getAudioContext().decodeAudioData(buf))
  .then((decoded) => {
    clickBuffer = decoded;
  });

export function playClick() {
  if (!clickBuffer || muted) return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const source = ctx.createBufferSource();
  source.buffer = clickBuffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  source.connect(gain).connect(ctx.destination);
  source.start(0);
}

// Failed guess audio set — shuffled, cycles through all
const failedClips = [
  new Audio(bugsySwingMiss),
  new Audio(bugsyAintItChief),
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const failedQueue: HTMLAudioElement[] = shuffle(failedClips);
let failedIndex = 0;

export function playFailedAudio() {
  const clip = failedQueue[failedIndex % failedQueue.length];
  failedIndex++;
  clip.currentTime = 0;
  clip.play();
}

const allAudio = [...Object.values(audio), ...failedClips, ...bgTracks];

// Global sound mute
let muted = false;
const muteListeners = new Set<(muted: boolean) => void>();

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  // Mute/unmute all HTMLAudioElement instances
  for (const el of allAudio) {
    el.muted = value;
  }
  // Suspend/resume Web Audio context (click sounds)
  if (audioCtx) {
    if (value) audioCtx.suspend();
    else audioCtx.resume();
  }
  muteListeners.forEach((fn) => fn(value));
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

export function onMuteChange(fn: (muted: boolean) => void) {
  muteListeners.add(fn);
  return () => { muteListeners.delete(fn); };
}

export const assetsReady: Promise<void> = Promise.all([
  ...Object.values(images).map(preloadImage),
  ...allAudio.map(preloadAudio),
]).then(() => {});

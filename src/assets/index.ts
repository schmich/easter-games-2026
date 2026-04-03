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
import jellyBeans from "./jelly-beans.webp";
import chocolateBunny from "./chocolate-bunny.webp";

// Audio
import bugsyEggdleWin from "./bugsy-eggdle-win.mp3";
import bugsySwingMiss from "./bugsy-swing-miss.mp3";
import bugsyIntro from "./bugsy-intro.mp3";
import announcerIntro from "./announcer-intro.mp3";
import announcerEggdle from "./announcer-eggdle.mp3";
import announcerConneggtions from "./announcer-conneggtions.mp3";
import bugsyAintItChief from "./bugsy-aint-it-chief.mp3";
import click from "./click.mp3";
import enter from "./enter.mp3";
import error from "./error.mp3";
import bgMusic1 from "./background-music-1.mp3";
import bgMusic2 from "./background-music-2.mp3";
import bgMusic3 from "./background-music-3.mp3";
import bgMusic4 from "./background-music-4.mp3";
import bgMusic5 from "./background-music-5.mp3";
import bgMusic6 from "./background-music-6.mp3";

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
  jellyBeans,
  chocolateBunny,
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
const bgTracks = shuffle([new Audio(bgMusic1), new Audio(bgMusic2), new Audio(bgMusic3), new Audio(bgMusic4), new Audio(bgMusic5), new Audio(bgMusic6)]);
let bgTrackIndex = 0;
let bgStarted = false;

function playNextBgTrack() {
  const track = bgTracks[bgTrackIndex % bgTracks.length];
  track.volume = 0.05;
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

// Mute state — declared early so playClick/playFailedAudio can reference it
let soundsMuted = false;
let musicMuted = false;

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
  if (!clickBuffer || soundsMuted) return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
  const source = ctx.createBufferSource();
  source.buffer = clickBuffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  source.connect(gain).connect(ctx.destination);
  source.start(0);
}

const enterSound = new Audio(enter);

export function playEnter() {
  if (soundsMuted) return;
  enterSound.currentTime = 0;
  enterSound.play();
}

const errorSound = new Audio(error);

export function playError() {
  if (soundsMuted) return;
  errorSound.currentTime = 0;
  errorSound.play();
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
  if (soundsMuted) return;
  const clip = failedQueue[failedIndex % failedQueue.length];
  failedIndex++;
  clip.currentTime = 0;
  clip.play();
}

const soundClips = [...Object.values(audio), ...failedClips, enterSound, errorSound];

const soundsListeners = new Set<(muted: boolean) => void>();
const musicListeners = new Set<(muted: boolean) => void>();

export function isSoundsMuted() {
  return soundsMuted;
}

export function isMusicMuted() {
  return musicMuted;
}

export function setSoundsMuted(value: boolean) {
  soundsMuted = value;
  for (const el of soundClips) {
    el.muted = value;
  }
  if (audioCtx) {
    if (value) audioCtx.suspend();
    else audioCtx.resume();
  }
  soundsListeners.forEach((fn) => fn(value));
}

export function setMusicMuted(value: boolean) {
  musicMuted = value;
  for (const el of bgTracks) {
    el.muted = value;
  }
  musicListeners.forEach((fn) => fn(value));
}

export function toggleSoundsMuted() {
  setSoundsMuted(!soundsMuted);
}

export function toggleMusicMuted() {
  setMusicMuted(!musicMuted);
}

export function onSoundsChange(fn: (muted: boolean) => void) {
  soundsListeners.add(fn);
  return () => { soundsListeners.delete(fn); };
}

export function onMusicChange(fn: (muted: boolean) => void) {
  musicListeners.add(fn);
  return () => { musicListeners.delete(fn); };
}

export const assetsReady: Promise<void> = Promise.all([
  ...Object.values(images).map(preloadImage),
  ...[...soundClips, ...bgTracks].map(preloadAudio),
]).then(() => {});

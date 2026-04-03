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

// Background music — loops bg-1 then bg-2 continuously
const bgTracks = [new Audio(bgMusic1), new Audio(bgMusic2), new Audio(bgMusic3)];
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

// Click sound pool for overlapping key presses
const clickPool = Array.from({ length: 5 }, () => {
  const a = new Audio(click);
  a.volume = 0.5;
  return a;
});
let clickIndex = 0;

export function playClick() {
  const clip = clickPool[clickIndex % clickPool.length];
  clickIndex++;
  clip.currentTime = 0;
  clip.play();
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

const allAudio = [...Object.values(audio), ...failedClips, ...bgTracks, ...clickPool];

export const assetsReady: Promise<void> = Promise.all([
  ...Object.values(images).map(preloadImage),
  ...allAudio.map(preloadAudio),
]).then(() => {});

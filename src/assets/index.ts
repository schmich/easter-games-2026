// Images
import grass from "./grass.webp";
import buggsy from "./buggsy.webp";
import buggsyLose from "./buggsy-lose.webp";
import buggsyEggdleIntro from "./buggsy-eggdle-intro.webp";
import buggsyConneggtionsIntro from "./buggsy-conneggtions-intro.webp";
import buggsyEggdleWinImg from "./buggsy-eggdle-win.webp";
import title from "./title.webp";
import banner from "./banner.webp";
import jellyBeans from "./jelly-beans.webp";
import chocolateBunny from "./chocolate-bunny.webp";
import goldBunnyLeft from "./gold-bunny-left.webp";
import goldBunnyRight from "./gold-bunny-right.webp";
import peepChick from "./peep-chick.webp";
import peepBunny from "./peep-bunny.webp";
import eggBorder from "./egg-border.webp";
import buggsyConneggtionsWinImg from "./buggsy-coneggtions-win.webp";
import loadingEgg from "./loading-egg.webp";
import peepGolden from "./peep-golden.webp";
import victoryDust from "./victory-dust.webp";
import victoryNote from "./victory-note.webp";
import cloud1 from "./cloud-1.webp";
import cloud2 from "./cloud-2.webp";
import cloud3 from "./cloud-3.webp";
import cloud4 from "./cloud-4.webp";
import cloud5 from "./cloud-5.webp";
import cloud6 from "./cloud-6.webp";
import cloud7 from "./cloud-7.webp";
import cloud8 from "./cloud-8.webp";
import cloud9 from "./cloud-9.webp";
import cloud10 from "./cloud-10.webp";

// Audio
import buggsyEggdleWin from "./buggsy-eggdle-win.mp3";
import buggsyMissSwing from "./buggsy-miss-swing.mp3";
import buggsyIntro from "./buggsy-intro.mp3";
import announcerIntro from "./announcer-intro.mp3";
import announcerEggdle from "./announcer-eggdle.mp3";
import announcerConneggtions from "./announcer-conneggtions.mp3";
import buggsyMissAintItChief from "./buggsy-miss-aint-it-chief.mp3";
import buggsyMissHardBoiledEgg from "./buggsy-miss-hard-boiled-egg.mp3";
import buggsyMissCottonTail from "./buggsy-miss-cotton-tail.mp3";
import buggsyMissBold from "./buggsy-miss-bold.mp3";
import buggsyMissWhiskers from "./buggsy-miss-whiskers.mp3";
import buggsyMissWarmer from "./buggsy-miss-warmer.mp3";
import buggsyMissSpring from "./buggsy-miss-spring.mp3";
import buggsyMissFloppy from "./buggsy-miss-floppy.mp3";
import buggsyMissMelted from "./buggsy-miss-melted.mp3";
import buggsyMissSetBack from "./buggsy-miss-set-back.mp3";
import buggsyMissSerious from "./buggsy-miss-serious.mp3";
import buggsyMissGray from "./buggsy-miss-gray.mp3";
import buggsyMissChipmunk from "./buggsy-miss-chipmunk.mp3";
import buggsyConneggtionsWin from "./buggsy-conneggtions-win.mp3";
import buggsyWelcomeTraveler from "./buggsy-title-welcome-travelers.mp3";
import buggsyWelcomeBackTraveler from "./buggsy-title-welcome-back-travelers.mp3";
import buggsyConneggtions1 from "./buggsy-conneggtions-1.mp3";
import buggsyConneggtions2 from "./buggsy-conneggtions-2.mp3";
import buggsyConneggtions3 from "./buggsy-conneggtions-3.mp3";
import click from "./click.mp3";
import continueSound from "./continue.mp3";
import enterSound from "./enter.mp3";
import error from "./error.mp3";
import bell from "./bell.mp3";
import clap from "./clap.mp3";
import buggsyVictory from "./buggsy-victory-speech.mp3";
import magic from "./magic.mp3";
import buggsyVictoryNote from "./buggsy-victory-note.mp3";
import victoryPoweringUp from "./victory-powering-up.mp3";
import buggsyLoseMad from "./buggsy-lose-mad.mp3";
import buggsyLoseEggShortage from "./buggsy-lose-egg-shortage.mp3";
import buggsyLoseSecondChances from "./buggsy-lose-second-chances.mp3";
import buggsyLoseTrip from "./buggsy-lose-trip.mp3";
import bgMusic1 from "./background-music-1.mp3";
import bgMusic2 from "./background-music-2.mp3";
import bgMusic3 from "./background-music-3.mp3";
import bgMusic4 from "./background-music-4.mp3";
import bgMusic5 from "./background-music-5.mp3";
import bgMusic6 from "./background-music-6.mp3";

export const images = {
  grass,
  buggsy,
  buggsyLose,
  buggsyEggdleIntro,
  buggsyConneggtionsIntro,
  buggsyEggdleWin: buggsyEggdleWinImg,
  title,
  banner,
  jellyBeans,
  chocolateBunny,
  peepChick,
  peepBunny,
  goldBunnyLeft,
  goldBunnyRight,
  eggBorder,
  buggsyConneggtionsWin: buggsyConneggtionsWinImg,
  loadingEgg,
  peepGolden,
  victoryDust,
  victoryNote,
  clouds: [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10],
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
  buggsyEggdleWin: new Audio(buggsyEggdleWin),
  buggsyIntro: new Audio(buggsyIntro),
  announcerIntro: new Audio(announcerIntro),
  announcerEggdle: new Audio(announcerEggdle),
  announcerConneggtions: new Audio(announcerConneggtions),
  buggsyConneggtionsWin: new Audio(buggsyConneggtionsWin),
  buggsyWelcomeTraveler: new Audio(buggsyWelcomeTraveler),
  buggsyWelcomeBackTraveler: new Audio(buggsyWelcomeBackTraveler),
  buggsyConneggtions1: new Audio(buggsyConneggtions1),
  buggsyConneggtions2: new Audio(buggsyConneggtions2),
  buggsyConneggtions3: new Audio(buggsyConneggtions3),
  buggsyVictory: new Audio(buggsyVictory),
  buggsyVictoryNote: new Audio(buggsyVictoryNote),
  magic: new Audio(magic),
  victoryPoweringUp: new Audio(victoryPoweringUp),
} as const;

export function stopAllVoices() {
  for (const el of Object.values(audio)) {
    el.pause();
    el.currentTime = 0;
    el.onended = null;
  }
}

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

export function stopBackgroundMusic(fadeDuration = 3000) {
  const track = bgTracks[bgTrackIndex % bgTracks.length];
  const startVolume = track.volume;
  const steps = 30;
  const interval = fadeDuration / steps;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    track.volume = Math.max(0, startVolume * (1 - step / steps));
    if (step >= steps) {
      clearInterval(timer);
      track.pause();
      track.onended = null;
    }
  }, interval);
}

// Mute state — declared early so playClick/playFailedAudio can reference it
let soundsMuted = localStorage.getItem("sounds-muted") === "1";
let musicMuted = localStorage.getItem("music-muted") === "1";

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

const continueSfx = new Audio(continueSound);
const enterSfx = new Audio(enterSound);

export function playContinue() {
  if (soundsMuted) return;
  continueSfx.currentTime = 0;
  continueSfx.play();
}

export function playEnter() {
  if (soundsMuted) return;
  enterSfx.currentTime = 0;
  enterSfx.play();
}

const errorSound = new Audio(error);
const bellSound = new Audio(bell);

export function playError() {
  if (soundsMuted) return;
  errorSound.currentTime = 0;
  errorSound.play();
}

export function playBell() {
  if (soundsMuted) return;
  bellSound.currentTime = 0;
  bellSound.play();
}

const clapSound = new Audio(clap);

export function playClap() {
  if (soundsMuted) return;
  clapSound.currentTime = 0;
  clapSound.play();
}

// Missed guess audio set — shuffled, cycles through all
const missedClips = [
  new Audio(buggsyMissSwing),
  new Audio(buggsyMissAintItChief),
  new Audio(buggsyMissHardBoiledEgg),
  new Audio(buggsyMissCottonTail),
  new Audio(buggsyMissBold),
  new Audio(buggsyMissWhiskers),
  new Audio(buggsyMissWarmer),
  new Audio(buggsyMissSpring),
  new Audio(buggsyMissFloppy),
  new Audio(buggsyMissMelted),
  new Audio(buggsyMissSetBack),
  new Audio(buggsyMissSerious),
  new Audio(buggsyMissGray),
  new Audio(buggsyMissChipmunk),
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const missedQueue: HTMLAudioElement[] = shuffle(missedClips);
let missedIndex = 0;

export function playMissedAudio() {
  if (soundsMuted) return;
  const clip = missedQueue[missedIndex % missedQueue.length];
  missedIndex++;
  clip.currentTime = 0;
  clip.play();
}

// Lose audio pool — shuffled once, cycles through on each game loss
const loseClips = [
  new Audio(buggsyLoseMad),
  new Audio(buggsyLoseEggShortage),
  new Audio(buggsyLoseSecondChances),
  new Audio(buggsyLoseTrip),
];

const loseQueue: HTMLAudioElement[] = shuffle(loseClips);
let loseIndex = 0;

export function playLoseAudio() {
  if (soundsMuted) return;
  const clip = loseQueue[loseIndex % loseQueue.length];
  loseIndex++;
  clip.currentTime = 0;
  clip.play();
}

const soundClips = [...Object.values(audio), ...missedClips, ...loseClips, continueSfx, enterSfx, errorSound, bellSound, clapSound];

// Apply persisted mute state on load
if (soundsMuted) {
  for (const el of soundClips) el.muted = true;
}
if (musicMuted) {
  for (const el of bgTracks) el.muted = true;
}

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
  localStorage.setItem("sounds-muted", value ? "1" : "0");
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
  localStorage.setItem("music-muted", value ? "1" : "0");
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

// Asset loading with progress tracking
const progressListeners = new Set<(progress: number) => void>();
let loadedCount = 0;

const allPreloads = [
  ...Object.values(images).flatMap((v) => typeof v === "string" ? [preloadImage(v)] : (v as readonly string[]).map((s) => preloadImage(s))),
  ...[...soundClips, ...bgTracks].map(preloadAudio),
];
const totalAssets = allPreloads.length;

export const assetsReady: Promise<void> = Promise.all(
  allPreloads.map((p) =>
    p.then(() => {
      loadedCount++;
      const progress = loadedCount / totalAssets;
      progressListeners.forEach((fn) => fn(progress));
    })
  )
).then(() => {});

export function onLoadProgress(fn: (progress: number) => void) {
  progressListeners.add(fn);
  if (loadedCount > 0) fn(loadedCount / totalAssets);
  return () => { progressListeners.delete(fn); };
}

// Images
import bunny from "./bunny.webp";
import basket from "./basket.webp";
import grass from "./grass.webp";
import eggsGrass from "./eggs-grass.webp";
import grassBasket from "./grass-basket.webp";
import eggfather from "./eggfather.webp";
import eggfatherWin from "./eggfather-win.webp";
import eggfatherLose from "./eggfather-lose.webp";

// Audio
import eggdleWin from "./eggfather-eggdle-win.mp3";
import introMusic from "./intro-music.mp3";

export const images = {
  bunny,
  basket,
  grass,
  eggsGrass,
  grassBasket,
  eggfather,
  eggfatherWin,
  eggfatherLose,
} as const;

// Preload all images and audio — returns a promise that resolves when all are loaded
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // don't block on errors
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
  eggdleWin: new Audio(eggdleWin),
  introMusic: new Audio(introMusic),
} as const;

export const assetsReady: Promise<void> = Promise.all([
  ...Object.values(images).map(preloadImage),
  ...Object.values(audio).map(preloadAudio),
]).then(() => {});

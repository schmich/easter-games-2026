import { useState, useEffect, useCallback } from "react";
import { images, audio, stopAllVoices, stopBackgroundMusic } from "../assets";
import Sparkles from "./Sparkles";
import SunRays from "./SunRays";
import Clouds from "./Clouds";

type Scene = "buggsy" | "peep" | "note";

export default function Victory() {
  const [scene, setScene] = useState<Scene>("buggsy");
  const [fading, setFading] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [fadeDuration, setFadeDuration] = useState(4000);

  // Scene 1: Play victory audio on mount
  useEffect(() => {
    stopAllVoices();
    const clip = audio.buggsyVictory;
    clip.currentTime = 0;
    clip.play();
    clip.onended = () => {
      setFadeDuration(4000);
      setFading(true);
      stopBackgroundMusic(4000);
    };
    return () => {
      clip.onended = null;
    };
  }, []);

  // Handle fade transition between scenes
  const handleFadeEnd = useCallback(() => {
    if (!fading) return;
    if (!sceneVisible) {
      // Screen is fully black — switch scene
      if (scene === "buggsy") setScene("peep");
      else if (scene === "peep") setScene("note");
      // Fade back in
      setSceneVisible(true);
    } else {
      // Scene is now visible, fade is done
      setFading(false);
    }
  }, [fading, sceneVisible, scene]);

  useEffect(() => {
    if (fading) setSceneVisible(false);
  }, [fading]);

  // Scene 2: Loop magic sound while peep scene is active
  useEffect(() => {
    if (scene !== "peep") return;
    const clip = audio.magic;
    clip.loop = true;
    clip.currentTime = 0;
    clip.play();
    return () => {
      clip.pause();
      clip.loop = false;
    };
  }, [scene]);

  // Scene 3: Play note audio when scene is fully visible (fade complete)
  useEffect(() => {
    if (scene !== "note" || fading || !sceneVisible) return;
    audio.buggsyVictoryNote.currentTime = 0;
    audio.buggsyVictoryNote.play();
  }, [scene, fading, sceneVisible]);

  // Scene 2: Peep tap handler
  const handlePeepTap = useCallback(() => {
    if (scene !== "peep" || fading) return;
    setFadeDuration(2000);
    setFading(true);
    // Fade magic audio out over 2s
    const clip = audio.magic;
    const startVolume = clip.volume;
    const steps = 30;
    const interval = 2000 / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      clip.volume = Math.max(0, startVolume * (1 - step / steps));
      if (step >= steps) clearInterval(timer);
    }, interval);
  }, [scene, fading]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: scene === "peep"
          ? "radial-gradient(circle, #e8b830 0%, #b8860b 40%, #7a5a0a 100%)"
          : scene === "note"
          ? "linear-gradient(180deg, #f0e6f6 0%, #e8f5e9 40%, #fef9e7 100%)"
          : "black",
      }}
    >
      {/* Scene content */}
      {scene === "buggsy" && (
        <div className="flex flex-col items-center z-10">
          <img
            src={images.buggsy}
            alt=""
            className="h-[50vh] max-h-[500px] w-auto animate-egg-pulse"
          />
        </div>
      )}

      {scene === "peep" && (
        <div className="flex items-center justify-center relative cursor-pointer" onClick={handlePeepTap}>
          {/* Pulsing gold background glow */}
          <div className="fixed inset-0 animate-shimmer" style={{ background: "radial-gradient(circle, rgba(255,248,225,0.4) 0%, rgba(246,196,67,0.2) 50%, transparent 80%)" }} />
          <SunRays />
          <div className="relative z-10" style={{ animation: "peep-pulse 4s ease-in-out infinite" }}>
            <img
              src={images.peepGolden}
              alt=""
              className="h-[43vh] max-h-[370px] w-auto"
            />
            <Sparkles active interval={80} minSize={4} maxSize={20} />
          </div>
        </div>
      )}

      {scene === "note" && (
        <>
          <Clouds inline />
          <img
            src={images.grass}
            alt=""
            className="absolute bottom-0 left-0 w-full pointer-events-none z-[11]"
          />
          <div className="fixed inset-0 flex flex-col items-center z-10 overflow-y-auto" style={{ paddingTop: "0" }}>
            <img
              src={images.victoryDust}
              alt=""
              className="w-[320px] max-w-[80vw] relative z-0 mt-4"
            />
            <img
              src={images.victoryNote}
              alt=""
              className="max-w-[95dvw] relative z-10 -mt-20"
              style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.85))" }}
            />
          </div>
        </>
      )}

      {/* Fade overlay */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50"
        style={{
          opacity: sceneVisible ? 0 : 1,
          transition: `opacity ${fadeDuration}ms ease-in-out`,
        }}
        onTransitionEnd={handleFadeEnd}
      />
    </div>
  );
}

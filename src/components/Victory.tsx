import { useState, useEffect, useCallback } from "react";
import { images, audio, stopAllVoices } from "../assets";
import Sparkles from "./Sparkles";
import SunRays from "./SunRays";

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
  }, [scene, fading]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden select-none"
      style={{
        background: scene === "peep"
          ? "radial-gradient(circle, #e8b830 0%, #b8860b 40%, #7a5a0a 100%)"
          : scene === "note" ? "#1a1a2e" : "black",
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
          <div className="relative z-10 animate-egg-pulse">
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
        <div className="flex flex-col items-center z-10 px-8 max-w-lg">
          <p className="text-[#e8d5f0] text-2xl text-center leading-relaxed italic">
            "You proved yourself in my games. Now prove yourself in the field. Two eggs are still out there. The hunt isn't over."
          </p>
          <p className="text-[#b07fd0] text-xl mt-6 text-right w-full">
            — B.B.
          </p>
        </div>
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

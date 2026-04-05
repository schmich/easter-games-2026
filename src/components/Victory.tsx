import { useState, useEffect, useCallback, useRef } from "react";
import { images, audio, stopAllVoices, stopBackgroundMusic, startBackgroundMusic, playExplosion, playMetalTap } from "../assets";
import Sparkles from "./Sparkles";
import SunRays from "./SunRays";
import Clouds from "./Clouds";

type Scene = "buggsy" | "peep" | "note";

const COLORS = [
  { color: "#b07fd0", light: "#f0e6f6" },
  { color: "#f6c443", light: "#fef9e7" },
  { color: "#77c572", light: "#e8f5e9" },
  { color: "#7eb8da", light: "#e8d5f0" },
  { color: "#e8a0c8", light: "#fff" },
];

const POSITIONS = [
  { top: "-12px", left: "50%", transform: "translateX(-50%)", tailX: -8, tailY: 4 },
  { bottom: "-10px", left: "50%", transform: "translateX(-50%)", tailX: 8, tailY: -4 },
  { top: "50%", left: "-10px", transform: "translateY(-50%)", tailX: 4, tailY: -8 },
  { top: "50%", right: "-12px", transform: "translateY(-50%)", tailX: -4, tailY: 8 },
  { top: "5%", right: "-6px", tailX: -6, tailY: 3 },
  { bottom: "5%", left: "-6px", tailX: 6, tailY: -3 },
  { top: "-6px", right: "25%", tailX: -5, tailY: 5 },
  { bottom: "-6px", left: "25%", tailX: 5, tailY: -5 },
  { top: "15%", left: "-4px", tailX: 3, tailY: -5 },
  { bottom: "15%", right: "-4px", tailX: -3, tailY: 5 },
  { top: "30%", right: "-5px", tailX: -4, tailY: 4 },
  { bottom: "30%", left: "-5px", tailX: 4, tailY: -4 },
  { top: "-8px", left: "30%", tailX: -4, tailY: 3 },
  { bottom: "-8px", right: "30%", tailX: 4, tailY: -3 },
  { top: "40%", left: "-3px", tailX: 3, tailY: -3 },
  { bottom: "40%", right: "-3px", tailX: -3, tailY: 3 },
  { top: "-10px", left: "20%", tailX: -5, tailY: 4 },
  { bottom: "-10px", right: "20%", tailX: 5, tailY: -4 },
  { top: "20%", left: "-8px", tailX: 4, tailY: -6 },
  { bottom: "20%", right: "-8px", tailX: -4, tailY: 6 },
  { top: "-6px", left: "70%", tailX: -3, tailY: 5 },
  { bottom: "-6px", right: "70%", tailX: 3, tailY: -5 },
  { top: "60%", left: "-6px", tailX: 5, tailY: -3 },
  { bottom: "60%", right: "-6px", tailX: -5, tailY: 3 },
  { top: "10%", right: "-10px", tailX: -6, tailY: 4 },
  { bottom: "10%", left: "-10px", tailX: 6, tailY: -4 },
];

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const SWIRL_ORBS = POSITIONS.map((pos, i) => {
  const c = COLORS[i % COLORS.length];
  const r = seededRandom(i);
  return {
    ...pos,
    color: c.color,
    colorLight: c.light,
    size: 6 + Math.round(r * 14),
    glow: 6 + Math.round(r * 10),
    duration: 1.8 + seededRandom(i + 100) * 2.2,
    delay: -(seededRandom(i + 200) * 3),
    reverse: i % 2 === 0,
    front: i % 3 !== 0,
    fadeIn: 1 + seededRandom(i + 300) * 4,
  };
});

const POWER_UP_DURATION = 19; // seconds

export default function Victory() {
  const [scene, setScene] = useState<Scene>("buggsy");
  const [fading, setFading] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(true);
  const [fadeDuration, setFadeDuration] = useState(4000);
  const [poweringUp, setPoweringUp] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [visibleOrbCount, setVisibleOrbCount] = useState(3);
  const [shaking, setShaking] = useState(false);

  const brightnessOverlayRef = useRef<HTMLDivElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  // Accept sequence state
  type AcceptPhase = "waiting1" | "playing1" | "waiting2" | "playing2" | "waiting3" | "playing3" | "ready";
  const acceptPhaseRef = useRef<AcceptPhase>("waiting1");
  const acceptTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const wait2ClickedRef = useRef(false);
  const wait2TimerDoneRef = useRef(false);

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
    const crossfadeTimer = setTimeout(() => setShowGift(true), 30000);
    return () => {
      clip.onended = null;
      clearTimeout(crossfadeTimer);
    };
  }, []);

  // Handle fade transition between scenes
  const handleFadeEnd = useCallback(() => {
    if (!fading) return;
    if (!sceneVisible) {
      // Screen is fully black — switch scene
      if (scene === "buggsy") {
        setScene("peep");
        setFadeDuration(4000);
        setSceneVisible(true);
      } else if (scene === "peep") {
        // Now safe to remove brightness overlay — screen is black
        setPoweringUp(false);
        setVisibleOrbCount(3);
        // Hold on black for 8s, then fade in to note
        setTimeout(() => {
          setScene("note");
          setFadeDuration(4000);
          setSceneVisible(true);
        }, 8000);
      }
    } else {
      // Scene is now visible, fade is done
      setFading(false);
    }
  }, [fading, sceneVisible, scene]);

  const handleFadeEndRef = useRef(handleFadeEnd);
  handleFadeEndRef.current = handleFadeEnd;

  useEffect(() => {
    if (!fading) return;
    setSceneVisible(false);
    // With fadeDuration=0, transition is "none" so transitionend won't fire.
    // Trigger handleFadeEnd manually after the browser paints the black screen.
    if (fadeDuration === 0) {
      requestAnimationFrame(() => handleFadeEndRef.current());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Helper to play an accept clip and advance phase
  const playAccept = useCallback((clip: HTMLAudioElement, nextPhase: AcceptPhase, onEnded?: () => void) => {
    clip.currentTime = 0;
    clip.play();
    clip.onended = () => {
      clip.onended = null;
      acceptPhaseRef.current = nextPhase;
      onEnded?.();
    };
  }, []);

  // Scene 2: Accept sequence on peep scene load
  useEffect(() => {
    if (scene !== "peep") return;
    acceptPhaseRef.current = "waiting1";
    wait2ClickedRef.current = false;
    wait2TimerDoneRef.current = false;

    // Wait 5s then auto-play accept-1
    acceptTimerRef.current = setTimeout(() => {
      if (acceptPhaseRef.current !== "waiting1") return;
      acceptPhaseRef.current = "playing1";
      playAccept(audio.buggsyVictoryAccept1, "waiting2", () => {
        // Start 3s timer for waiting2
        wait2TimerDoneRef.current = false;
        wait2ClickedRef.current = false;
        acceptTimerRef.current = setTimeout(() => {
          wait2TimerDoneRef.current = true;
          if (wait2ClickedRef.current) {
            acceptPhaseRef.current = "playing2";
            playAccept(audio.buggsyVictoryAccept2, "waiting3", () => {
              acceptTimerRef.current = setTimeout(() => {
                acceptPhaseRef.current = "playing3";
                playAccept(audio.buggsyVictoryAccept3, "ready");
              }, 5000);
            });
          }
        }, 3000);
      });
    }, 5000);

    return () => {
      if (acceptTimerRef.current) clearTimeout(acceptTimerRef.current);
      audio.buggsyVictoryAccept1.pause();
      audio.buggsyVictoryAccept1.onended = null;
      audio.buggsyVictoryAccept2.pause();
      audio.buggsyVictoryAccept2.onended = null;
      audio.buggsyVictoryAccept3.pause();
      audio.buggsyVictoryAccept3.onended = null;
    };
  }, [scene, playAccept]);

  // Scene 3: Play note audio when scene is fully visible, then restart bg music
  useEffect(() => {
    if (scene !== "note" || fading || !sceneVisible) return;
    const clip = audio.buggsyVictoryNote;
    clip.currentTime = 0;
    clip.play();
    clip.onended = () => {
      setTimeout(() => startBackgroundMusic(), 5000);
    };
    return () => {
      clip.onended = null;
    };
  }, [scene, fading, sceneVisible]);

  // Scene 1: Skip speech on click
  const handleBuggsyTap = useCallback(() => {
    if (scene !== "buggsy" || fading) return;
    audio.buggsyVictory.pause();
    audio.buggsyVictory.onended = null;
    setFadeDuration(4000);
    setFading(true);
    stopBackgroundMusic(4000);
  }, [scene, fading]);

  // Power-up progress loop — drives orb count, speed, and brightness
  useEffect(() => {
    if (!poweringUp) return;
    let lastOrbCount = 3;
    let concernPlayed = false;
    let cuckooPlayed = false;
    let electricityStarted = false;
    const tick = () => {
      const p = Math.min(1, audio.victoryPoweringUp.currentTime / POWER_UP_DURATION);
      const t = audio.victoryPoweringUp.currentTime;

      // Play concern clip at 2s
      if (!concernPlayed && t >= 2) {
        concernPlayed = true;
        audio.buggsyVictoryConcern.currentTime = 0;
        audio.buggsyVictoryConcern.play();
      }

      // Start electricity loop at 10s
      if (!electricityStarted && t >= 10) {
        electricityStarted = true;
        audio.electricity.loop = true;
        audio.electricity.currentTime = 0;
        audio.electricity.play();
      }

      // Play cuckoo at 15s
      if (!cuckooPlayed && t >= 16.5) {
        cuckooPlayed = true;
        audio.cuckoo.currentTime = 0;
        audio.cuckoo.play();
      }

      // Orb count: linear 3 → 26
      const orbCount = Math.min(26, 3 + Math.round(p * 23));
      if (orbCount !== lastOrbCount) {
        lastOrbCount = orbCount;
        setVisibleOrbCount(orbCount);
      }

      // Speed: quadratic 1 → 5 — update via Web Animations API (no re-render)
      const speed = 1 + 4 * p * p;
      if (orbContainerRef.current) {
        for (const anim of orbContainerRef.current.getAnimations({ subtree: true })) {
          if (anim instanceof CSSAnimation && anim.animationName === "swirl-ring") {
            anim.playbackRate = speed;
          }
        }
      }

      // Brightness: cubic 1.0 → 6.0
      const brightness = 1 + 6 * p * p * p;
      if (brightnessOverlayRef.current) {
        brightnessOverlayRef.current.style.backdropFilter = `brightness(${brightness})`;
        (brightnessOverlayRef.current.style as unknown as Record<string, string>).webkitBackdropFilter = `brightness(${brightness})`;
      }

      if (p < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [poweringUp]);

  // Cleanup power-up audio on unmount
  useEffect(() => {
    return () => {
      audio.victoryPoweringUp.pause();
      audio.victoryPoweringUp.onended = null;
    };
  }, []);

  // Scene 2: Peep tap handler — accept sequence + power-up
  const startPowerUp = useCallback(() => {
    // Start power-up audio
    const powerClip = audio.victoryPoweringUp;
    powerClip.currentTime = 0;
    powerClip.play();

    // Begin progressive power-up animation
    setPoweringUp(true);

    // Fade out magic loop over 19s
    const magicClip = audio.magic;
    const startVolume = magicClip.volume;
    const steps = 60;
    const interval = (POWER_UP_DURATION * 1000) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      magicClip.volume = Math.max(0, startVolume * (1 - step / steps));
      if (step >= steps) clearInterval(timer);
    }, interval);

    // When power-up audio ends: instant cut to black, then handleFadeEnd takes over
    powerClip.onended = () => {
      audio.electricity.pause();
      audio.electricity.loop = false;
      playExplosion();
      setFadeDuration(0);
      setFading(true);
    };
  }, []);

  const handlePeepTap = useCallback(() => {
    if (scene !== "peep" || poweringUp) return;
    const phase = acceptPhaseRef.current;

    if (phase === "waiting1") {
      // Just tap sound, wait for timer
      playMetalTap();
    } else if (phase === "waiting2") {
      // Click registered — if 3s already passed, play accept-2
      playMetalTap();
      wait2ClickedRef.current = true;
      if (wait2TimerDoneRef.current) {
        acceptPhaseRef.current = "playing2";
        playAccept(audio.buggsyVictoryAccept2, "waiting3", () => {
          acceptTimerRef.current = setTimeout(() => {
            acceptPhaseRef.current = "playing3";
            playAccept(audio.buggsyVictoryAccept3, "ready");
          }, 5000);
        });
      }
    } else if (phase === "ready") {
      audio.gong.currentTime = 0;
      audio.gong.play();
      setShaking(true);
      startPowerUp();
    } else {
      // playing1, playing2, waiting3, playing3 — tap sound but no action
      playMetalTap();
    }
  }, [scene, fading, poweringUp, playAccept, startPowerUp]);

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
        <div className="fixed inset-0 z-10 cursor-pointer" onClick={handleBuggsyTap}>
          <img
            src={images.victoryBuggsyGift}
            alt=""
            className="w-full h-full object-cover"
          />
          <img
            src={images.victoryBuggsyTears}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out"
            style={{
              opacity: showGift ? 0 : 1,
              transformOrigin: "50% 20%",
              animation: "slow-zoom 30s linear forwards",
            }}
          />
        </div>
      )}

      {scene === "peep" && (
        <div className="flex items-center justify-center relative cursor-pointer" onClick={handlePeepTap}>
          {/* Pulsing gold background glow */}
          <div className="fixed inset-0 animate-shimmer" style={{ background: "radial-gradient(circle, rgba(255,248,225,0.4) 0%, rgba(246,196,67,0.2) 50%, transparent 80%)" }} />
          <SunRays />
          <div className="relative z-10" style={shaking ? { animationName: "peep-shake", animationDuration: "1.5s", animationTimingFunction: "ease-out", animationIterationCount: "1" } : undefined}>
          <div ref={orbContainerRef} className="relative" style={{ animationName: "peep-pulse", animationDuration: "4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }}>
            {poweringUp && SWIRL_ORBS.slice(0, visibleOrbCount).filter((o) => !o.front).map((orb, i) => (
              <div key={`b${i}`} className="absolute inset-0 pointer-events-none" style={{
                animationName: "swirl-ring, orb-fade-in",
                animationDuration: `${orb.duration}s, ${orb.fadeIn}s`,
                animationTimingFunction: "linear, ease-out",
                animationIterationCount: "infinite, 1",
                animationDirection: `${orb.reverse ? "reverse" : "normal"}, normal`,
                animationFillMode: "none, forwards",
                animationDelay: `${orb.delay}s, 0s`,
                opacity: 0,
              }}>
                <div className="absolute rounded-full" style={{
                  width: orb.size, height: orb.size, top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom, transform: orb.transform,
                  background: `radial-gradient(circle, ${orb.colorLight}, ${orb.color})`,
                  boxShadow: `0 0 ${orb.glow}px ${orb.glow / 2}px ${orb.color}99, ${orb.tailX}px ${orb.tailY}px ${orb.glow * 2}px ${orb.color}44, ${orb.tailX * 2}px ${orb.tailY * 2}px ${orb.glow * 3}px ${orb.color}22`,
                }} />
              </div>
            ))}
            <img
              src={images.peepGolden}
              alt=""
              className="relative z-10 h-[43vh] max-h-[370px] w-auto"
            />
            <Sparkles active interval={40} minSize={3} maxSize={22} circular />
            {poweringUp && SWIRL_ORBS.slice(0, visibleOrbCount).filter((o) => o.front).map((orb, i) => (
              <div key={`f${i}`} className="absolute inset-0 pointer-events-none z-20" style={{
                animationName: "swirl-ring, orb-fade-in",
                animationDuration: `${orb.duration}s, ${orb.fadeIn}s`,
                animationTimingFunction: "linear, ease-out",
                animationIterationCount: "infinite, 1",
                animationDirection: `${orb.reverse ? "reverse" : "normal"}, normal`,
                animationFillMode: "none, forwards",
                animationDelay: `${orb.delay}s, 0s`,
                opacity: 0,
              }}>
                <div className="absolute rounded-full" style={{
                  width: orb.size, height: orb.size, top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom, transform: orb.transform,
                  background: `radial-gradient(circle, ${orb.colorLight}, ${orb.color})`,
                  boxShadow: `0 0 ${orb.glow}px ${orb.glow / 2}px ${orb.color}99, ${orb.tailX}px ${orb.tailY}px ${orb.glow * 2}px ${orb.color}44, ${orb.tailX * 2}px ${orb.tailY * 2}px ${orb.glow * 3}px ${orb.color}22`,
                }} />
              </div>
            ))}
          </div>
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

      {/* Brightness power-up overlay */}
      <div
        ref={brightnessOverlayRef}
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          backdropFilter: "brightness(1)",
          WebkitBackdropFilter: "brightness(1)",
          display: poweringUp ? "block" : "none",
        }}
      />

      {/* Fade overlay */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50"
        style={{
          opacity: sceneVisible ? 0 : 1,
          transition: fadeDuration > 0 ? `opacity ${fadeDuration}ms ease-in-out` : "none",
        }}
        onTransitionEnd={handleFadeEnd}
      />
    </div>
  );
}

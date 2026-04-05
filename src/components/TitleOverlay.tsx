import { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Button, useOverlayState } from "@heroui/react";
import Sparkles from "./Sparkles";
import SunRays from "./SunRays";
import { assetsReady, images, audio, isSoundsMuted, isMusicMuted, toggleSoundsMuted, toggleMusicMuted, onSoundsChange, onMusicChange, playContinue, playBell, playClick, onLoadProgress } from "../assets";
import { isRandomMode, toggleGameMode, onGameModeChange } from "../lib/gameMode";

interface TitleOverlayProps {
  isOpen: boolean;
  onDismiss: () => void;
  onLoaded?: () => void;
}

const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

export default function TitleOverlay({ isOpen, onDismiss, onLoaded }: TitleOverlayProps) {
  const state = useOverlayState({ isOpen, onOpenChange: () => {} });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [shrinking, setShrinking] = useState(false);
  const dismissedRef = useRef(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [soundsMuted, setSoundsMuted] = useState(isSoundsMuted);
  const [musicMuted, setMusicMuted] = useState(isMusicMuted);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [randomMode, setRandomMode] = useState(isRandomMode);

  useEffect(() => onSoundsChange(setSoundsMuted), []);
  useEffect(() => onMusicChange(setMusicMuted), []);
  useEffect(() => onGameModeChange(() => setRandomMode(isRandomMode())), []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  // Track loading progress
  useEffect(() => onLoadProgress(setProgress), []);

  // Mark loaded when assets are ready
  useEffect(() => {
    assetsReady.then(() => setLoaded(true));
  }, []);

  // Notify parent when dialog is shown
  useEffect(() => {
    if (showDialog) onLoaded?.();
  }, [showDialog]);

  // Play welcome audio after dialog shows
  useEffect(() => {
    if (!showDialog) return;
    const seen = localStorage.getItem("title-seen") === "1";
    const clip = seen ? audio.buggsyWelcomeBackTraveler : audio.buggsyWelcomeTraveler;
    localStorage.setItem("title-seen", "1");
    const t = setTimeout(() => {
      clip.currentTime = 0;
      clip.play();
    }, 2000);
    return () => clearTimeout(t);
  }, [showDialog]);

  // Handle egg click
  const handleEggClick = useCallback(() => {
    if (!loaded || dismissedRef.current) return;
    dismissedRef.current = true;
    playBell();
    setShrinking(true);
    setTimeout(() => {
      setShowDialog(true);
      setTimeout(() => setShowButton(true), 50);
    }, 600);
  }, [loaded]);

  // Enter key on egg
  useEffect(() => {
    if (!loaded || showDialog) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter") handleEggClick(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loaded, showDialog, handleEggClick]);

  const handleContinue = useCallback(() => { playContinue(); onDismiss(); }, [onDismiss]);

  useEffect(() => {
    if (!showButton) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Enter") handleContinue(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showButton, handleContinue]);


  // Non-mobile: show QR code screen only
  if (!isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 gap-4">
        <p className="text-[#6b4c8a] text-lg font-medium">Intended as a mobile experience only</p>
        <img src={images.qr} alt="QR code" className="w-48 h-48" />
      </div>
    );
  }

  // Phase 1: Loading egg
  if (!showDialog) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-0 ${loaded ? "cursor-pointer" : ""}`} onClick={handleEggClick}>
        {!shrinking && (
          <div
            className="absolute pointer-events-none transition-opacity duration-700 ease-out"
            style={{
              width: "200vmax",
              height: "200vmax",
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%",
              borderRadius: "50%",
              animation: "shimmer 3s ease-in-out infinite, egg-glow-regal 10s ease-in-out infinite",
              maskImage: "radial-gradient(ellipse, black 0%, black 8%, transparent 30%)",
              WebkitMaskImage: "radial-gradient(ellipse, black 0%, black 8%, transparent 30%)",
              opacity: loaded ? 1 : 0,
            }}
          />
        )}
        <div
          className={`relative ${
            shrinking ? "animate-egg-dismiss" : ""
          } ${loaded && !shrinking ? "animate-egg-pulse" : ""}`}
        >
          {/* Full color egg (bottom layer) */}
          <img
            src={images.loadingEgg}
            alt=""
            className="h-[43vh] max-h-[370px] max-w-[70dvw] w-auto"
          />
          {/* Gray desaturated overlay (top layer) — clips from top down as progress increases */}
          <img
            src={images.loadingEgg}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{
              filter: "grayscale(100%) contrast(0.5) brightness(1.5)",
              clipPath: `inset(0 0 ${progress * 100}% 0)`,
              transition: "clip-path 0.3s ease-out",
            }}
          />
          <Sparkles active={loaded && !shrinking} interval={200} minSize={8} maxSize={16} padX={20} padY={15} />
        </div>
      </div>
    );
  }

  // Phase 2: Title dialog
  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/10 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm" className="!overflow-visible relative">
          {showButton && <SunRays />}
          <Modal.Dialog className="bg-white rounded-2xl p-0 !overflow-visible animate-shadow-cycle">
            <div className="h-3 w-full animate-gradient-cycle rounded-t-2xl" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center !overflow-visible">
              <div className={`w-full overflow-hidden transition-opacity duration-250 flex justify-center ${
                showButton ? "opacity-100" : "opacity-0"
              }`}>
                <img src={images.title} alt="Buggsy's Easter Games" className="w-[384px] max-w-none shrink-0" />
              </div>
              <div className={`flex flex-col items-center transition-opacity duration-250 -mx-8 !overflow-visible ${
                showButton ? "opacity-100" : "opacity-0"
              }`}>
                <div className="relative flex justify-center -mt-[98px]" style={{ marginLeft: "-70px", marginRight: "-70px" }}>
                  <div className="relative w-[520px] max-w-[110dvw]">
                    <img src={images.banner} alt="Buggsy's Easter Games" className="w-full" />
                    <Sparkles active={showButton} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-80 -mt-[10px]">
                  <div className="flex gap-3 w-full">
                    <Button
                      onPress={() => { playClick(); toggleFullscreen(); }}
                      className="bg-gradient-to-r from-[#7eb8da] to-[#a0d0ef] text-white text-base flex-1 basis-0 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isFullscreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 14 10 14 10 20" />
                          <polyline points="20 10 14 10 14 4" />
                          <line x1="14" y1="10" x2="21" y2="3" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      )}
                      {isFullscreen ? "Exit" : "Fullscreen"}
                    </Button>
                    <Button
                      onPress={() => { playClick(); toggleGameMode(); }}
                      className="bg-gradient-to-r from-[#7eb8da] to-[#a0d0ef] text-white text-base flex-1 basis-0 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {randomMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 3 21 3 21 8" />
                          <line x1="4" y1="20" x2="21" y2="3" />
                          <polyline points="21 16 21 21 16 21" />
                          <line x1="15" y1="15" x2="21" y2="21" />
                          <line x1="4" y1="4" x2="9" y2="9" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                      {randomMode ? "Randomize" : "Standard"}
                    </Button>
                  </div>
                  <div className="flex gap-3 w-full">
                    <Button
                      onPress={() => { playClick(); toggleSoundsMuted(); }}
                      className={`bg-gradient-to-r from-[#b07fd0] to-[#cda4e6] text-white text-base flex-1 basis-0 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 ${soundsMuted ? "opacity-50" : ""}`}
                    >
                      {soundsMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                      Sounds
                    </Button>
                    <Button
                      onPress={() => { playClick(); toggleMusicMuted(); }}
                      className={`bg-gradient-to-r from-[#b07fd0] to-[#cda4e6] text-white text-base flex-1 basis-0 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 ${musicMuted ? "opacity-50" : ""}`}
                    >
                      {musicMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="5.5" cy="17.5" r="2.5" />
                          <path d="M8 17.5V3l12 2v12.5" />
                          <circle cx="17.5" cy="17.5" r="2.5" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="5.5" cy="17.5" r="2.5" />
                          <path d="M8 17.5V3l12 2v12.5" />
                          <circle cx="17.5" cy="17.5" r="2.5" />
                        </svg>
                      )}
                      Music
                    </Button>
                  </div>
                </div>
                <Button
                  onPress={handleContinue}
                  className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl w-80 mt-4 mb-4 py-6 rounded-full shadow-lg hover:scale-105 transition-all duration-250 cursor-pointer"
                >
                  Play
                </Button>
              </div>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

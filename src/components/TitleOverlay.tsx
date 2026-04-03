import { useState, useEffect, useCallback } from "react";
import { Modal, Button, useOverlayState } from "@heroui/react";
import { assetsReady, images, isSoundsMuted, isMusicMuted, toggleSoundsMuted, toggleMusicMuted, onSoundsChange, onMusicChange, playEnter } from "../assets";

interface TitleOverlayProps {
  isOpen: boolean;
  onDismiss: () => void;
  onLoaded?: () => void;
}

export default function TitleOverlay({ isOpen, onDismiss, onLoaded }: TitleOverlayProps) {
  const state = useOverlayState({ isOpen, onOpenChange: () => {} });
  const [loaded, setLoaded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [soundsMuted, setSoundsMuted] = useState(isSoundsMuted);
  const [musicMuted, setMusicMuted] = useState(isMusicMuted);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => onSoundsChange(setSoundsMuted), []);
  useEffect(() => onMusicChange(setMusicMuted), []);

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

  useEffect(() => {
    const minDelay = new Promise((r) => setTimeout(r, 1000));
    Promise.all([assetsReady, minDelay]).then(() => setFadingOut(true));
  }, []);

  useEffect(() => {
    if (fadingOut) {
      const t = setTimeout(() => {
        setLoaded(true);
        onLoaded?.();
        setTimeout(() => setShowButton(true), 50);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [fadingOut]);

  return (
    <Modal state={state}>
      <Modal.Backdrop
        isDismissable={false}
        className="bg-black/10 backdrop-blur-sm"
      >
        <Modal.Container placement="center" size="sm" className="!overflow-visible">
          <Modal.Dialog className="bg-white rounded-2xl p-0 overflow-hidden animate-shadow-cycle">
            <div className="h-3 w-full animate-gradient-cycle rounded-t-2xl" style={{ background: "linear-gradient(90deg, #f6c443, #77c572, #b07fd0, #7eb8da, #f6c443)", backgroundSize: "200% 100%" }} />

            <div className="flex flex-col items-center px-8 py-8">
              {!loaded ? (
                <div
                  className={`w-48 h-2 bg-[#e8d5f0] rounded-full overflow-hidden transition-opacity duration-250 ${
                    fadingOut ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="h-full bg-gradient-to-r from-[#6b4c8a] to-[#b07fd0] rounded-full animate-loading-bar" />
                </div>
              ) : (
                <div className={`flex flex-col items-center transition-opacity duration-250 -mx-8 ${
                  showButton ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="relative w-full -mt-8">
                    <img src={images.title} alt="2026 Easter Games" className="w-full" />
                  </div>
                  <div className="flex flex-col gap-3 w-64 mt-36">
                    <Button
                      onPress={toggleFullscreen}
                      className="bg-gradient-to-r from-[#7eb8da] to-[#a0d0ef] text-white text-base w-full py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
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
                      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    </Button>
                    <div className="flex gap-3 w-full">
                      <Button
                        onPress={toggleSoundsMuted}
                        className={`bg-gradient-to-r from-[#b07fd0] to-[#cda4e6] text-white text-base flex-1 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 ${soundsMuted ? "opacity-50" : ""}`}
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
                        onPress={toggleMusicMuted}
                        className={`bg-gradient-to-r from-[#b07fd0] to-[#cda4e6] text-white text-base flex-1 py-4 rounded-full shadow-md hover:scale-105 transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 ${musicMuted ? "opacity-50" : ""}`}
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
                    onPress={() => { playEnter(); onDismiss(); }}
                    className="bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl w-64 mt-4 mb-4 py-6 rounded-full shadow-lg hover:scale-105 transition-all duration-250 cursor-pointer"
                  >
                    Play
                  </Button>
                </div>
              )}
            </div>
          </Modal.Dialog>
          {loaded && showButton && (
            <img src={images.banner} alt="The 2026 Easter Games" className="absolute left-1/2 -translate-x-1/2 w-[520px] max-w-[110dvw] pointer-events-none" style={{ top: "27%" }} />
          )}
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

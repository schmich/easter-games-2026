import { useState, useEffect, useCallback } from "react";
import { Dropdown } from "@heroui/react";
import { images, isSoundsMuted, isMusicMuted, toggleSoundsMuted, toggleMusicMuted, onSoundsChange, onMusicChange } from "../assets";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
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

  return (
    <header className="flex items-center justify-center border-b border-[#e8d5f0] px-4 h-[56px] shrink-0 bg-white/80 backdrop-blur-sm relative">
      <div className="flex items-center gap-3">
        <img src={images.bunny} alt="" className="h-9 w-auto" />
        <h1 className="text-[1.8rem] uppercase text-[#6b4c8a]">
          {title}
        </h1>
        <img src={images.basket} alt="" className="h-9 w-auto" />
      </div>
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b4c8a] hover:text-[#5a3d78] transition-colors cursor-pointer"
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <Dropdown>
        <Dropdown.Trigger>
          <div
            role="button"
            tabIndex={0}
            aria-label="Audio settings"
            className="text-[#6b4c8a] hover:text-[#5a3d78] transition-colors cursor-pointer"
          >
            {soundsMuted && musicMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </div>
        </Dropdown.Trigger>
        <Dropdown.Popover className="min-w-[140px] rounded-lg">
          <Dropdown.Menu aria-label="Audio settings" selectionMode="multiple">
            <Dropdown.Item id="sounds" onAction={toggleSoundsMuted} className="text-[#6b4c8a] cursor-pointer">
              <span className="flex items-center justify-between w-full">
                <span>Sounds</span>
                <span className={`text-xs ${soundsMuted ? "opacity-40" : ""}`}>{soundsMuted ? "OFF" : "ON"}</span>
              </span>
            </Dropdown.Item>
            <Dropdown.Item id="music" onAction={toggleMusicMuted} className="text-[#6b4c8a] cursor-pointer">
              <span className="flex items-center justify-between w-full">
                <span>Music</span>
                <span className={`text-xs ${musicMuted ? "opacity-40" : ""}`}>{musicMuted ? "OFF" : "ON"}</span>
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      </div>
    </header>
  );
}

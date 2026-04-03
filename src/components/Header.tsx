import { useState, useEffect } from "react";
import { images, isMuted, toggleMuted, onMuteChange } from "../assets";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [muted, setMuted] = useState(isMuted);

  useEffect(() => onMuteChange(setMuted), []);

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
        onClick={toggleMuted}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b4c8a] hover:text-[#5a3d78] transition-colors cursor-pointer"
      >
        {muted ? (
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
      </button>
    </header>
  );
}

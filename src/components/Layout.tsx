import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { images, startBackgroundMusic } from "../assets";
import TitleOverlay from "./TitleOverlay";

export default function Layout() {
  const [titleDismissed, setTitleDismissed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showDecorations, setShowDecorations] = useState(false);

  useEffect(() => {
    if (!assetsLoaded) return;
    const t = setTimeout(() => setShowDecorations(true), 300);
    return () => clearTimeout(t);
  }, [assetsLoaded]);

  return (
    <div
      className="flex flex-col h-dvh font-sans select-none relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f0e6f6 0%, #e8f5e9 40%, #fef9e7 100%)",
      }}
    >
      {!titleDismissed && <div className="absolute inset-0 pointer-events-none" style={{ animation: "bg-regal 12s ease-in-out infinite" }} />}
      {/* Easter decorations */}
      {(titleDismissed || assetsLoaded) && (
        <img
          src={images.grass}
          alt=""
          className={`absolute bottom-0 left-0 w-full opacity-100 pointer-events-none z-[11] ${!titleDismissed ? "animate-grow-in" : ""}`}
        />
      )}

      {titleDismissed ? (
        <div className="flex flex-col flex-1 overflow-hidden relative z-[12]">
          <Outlet />
        </div>
      ) : (
        <>
          <TitleOverlay isOpen onLoaded={() => { setAssetsLoaded(true); startBackgroundMusic(); }} onDismiss={() => setTitleDismissed(true)} />
          {showDecorations && <>
            <img src={images.jellyBeans} alt="" className="fixed top-1/2 left-1/2 w-36 pointer-events-none z-[9999] opacity-0" style={{ marginLeft: "-240px", marginTop: "230px", "--wobble-base": "-12deg", animation: "pop-in 0.5s ease-out forwards, wobble-float 8s ease-in-out 0.5s infinite" } as React.CSSProperties} />
            <img src={images.chocolateBunny} alt="" className="fixed top-1/2 left-1/2 w-32 pointer-events-none z-[9999] opacity-0" style={{ marginLeft: "110px", marginTop: "150px", "--wobble-base": "12deg", animation: "pop-in 0.5s ease-out 0.15s forwards, wobble-float 8s ease-in-out 0.65s infinite" } as React.CSSProperties} />
          </>}
        </>
      )}
    </div>
  );
}

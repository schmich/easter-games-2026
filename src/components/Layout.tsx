import { useState } from "react";
import { Outlet } from "react-router-dom";
import { images, startBackgroundMusic } from "../assets";
import TitleOverlay from "./TitleOverlay";

export default function Layout() {
  const [titleDismissed, setTitleDismissed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <div
      className="flex flex-col h-dvh font-sans select-none relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f0e6f6 0%, #e8f5e9 40%, #fef9e7 100%)",
      }}
    >
      {/* Easter decorations */}
      <img
        src={images.grass}
        alt=""
        className="absolute bottom-0 left-0 w-full opacity-100 pointer-events-none z-[1]"
      />

      {titleDismissed ? (
        <div className="flex flex-col flex-1 overflow-hidden relative z-10">
          <Outlet />
        </div>
      ) : (
        <>
          <TitleOverlay isOpen onLoaded={() => setAssetsLoaded(true)} onDismiss={() => { startBackgroundMusic(); setTitleDismissed(true); }} />
          {assetsLoaded && <>
            <img src={images.jellyBeans} alt="" className="fixed top-1/2 left-1/2 w-36 pointer-events-none z-[9999] animate-wobble-float" style={{ marginLeft: "-240px", marginTop: "230px", "--wobble-base": "-12deg" } as React.CSSProperties} />
            <img src={images.chocolateBunny} alt="" className="fixed top-1/2 left-1/2 w-32 pointer-events-none z-[9999] animate-wobble-float" style={{ marginLeft: "110px", marginTop: "150px", "--wobble-base": "12deg", animationDelay: "-3s" } as React.CSSProperties} />
          </>}
        </>
      )}
    </div>
  );
}

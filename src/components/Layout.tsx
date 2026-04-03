import { useState } from "react";
import { Outlet } from "react-router-dom";
import { images, startBackgroundMusic } from "../assets";
import LoaderOverlay from "./LoaderOverlay";

export default function Layout() {
  const [loaderDismissed, setLoaderDismissed] = useState(false);
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
        className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none z-[1]"
      />

      {loaderDismissed ? (
        <div className="flex flex-col flex-1 overflow-hidden relative z-10">
          <Outlet />
        </div>
      ) : (
        <>
          <LoaderOverlay isOpen onLoaded={() => setAssetsLoaded(true)} onDismiss={() => { startBackgroundMusic(); setLoaderDismissed(true); }} />
          {assetsLoaded && <>
            <img src={images.jellyBeans} alt="" className="fixed top-1/2 left-1/2 w-36 pointer-events-none z-[9999] animate-wobble-float" style={{ marginLeft: "-240px", marginTop: "200px", "--wobble-base": "-12deg" } as React.CSSProperties} />
            <img src={images.chocolateBunny} alt="" className="fixed top-1/2 left-1/2 w-32 pointer-events-none z-[9999] animate-wobble-float" style={{ marginLeft: "110px", marginTop: "150px", "--wobble-base": "12deg", animationDelay: "-3s" } as React.CSSProperties} />
          </>}
        </>
      )}
    </div>
  );
}

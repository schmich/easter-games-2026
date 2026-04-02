import { Outlet, useLocation } from "react-router-dom";
import { images } from "../assets";

export default function Layout() {
  const isLoading = useLocation().pathname === "/";

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
      {!isLoading && (
        <>
          <img
            src={images.bunny}
            alt=""
            className="absolute top-[70px] left-3 w-[60px] opacity-30 pointer-events-none animate-float"
          />
          <img
            src={images.basket}
            alt=""
            className="absolute top-[70px] right-3 w-[60px] opacity-30 pointer-events-none animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </>
      )}

      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Outlet />
      </div>
    </div>
  );
}

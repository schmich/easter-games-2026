import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assetsReady } from "../assets";

export default function Loading() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((r) => setTimeout(r, 2000));
    Promise.all([assetsReady, minDelay]).then(() => setFadingOut(true));
  }, []);

  useEffect(() => {
    if (fadingOut) {
      const t = setTimeout(() => {
        setLoaded(true);
        setTimeout(() => setShowButton(true), 50);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [fadingOut]);

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {!loaded ? (
        <div
          className={`w-48 h-2 bg-[#e8d5f0] rounded-full overflow-hidden transition-opacity duration-250 ${
            fadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="h-full bg-gradient-to-r from-[#6b4c8a] to-[#b07fd0] rounded-full animate-loading-bar" />
        </div>
      ) : (
        <button
          onClick={() => navigate("/intro")}
          className={`bg-gradient-to-r from-[#5aad55] to-[#77c572] text-white text-xl px-16 py-6 rounded-full shadow-lg hover:scale-105 transition-all duration-250 cursor-pointer max-w-[90dvw] ${
            showButton ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          Continue
        </button>
      )}
    </div>
  );
}

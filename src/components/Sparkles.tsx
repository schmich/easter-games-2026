import { useState, useEffect, useRef } from "react";

interface SparklesProps {
  active?: boolean;
  interval?: number;
  lifetime?: number;
  count?: number;
  minSize?: number;
  maxSize?: number;
  padX?: number;
  padY?: number;
}

export default function Sparkles({
  active = true,
  interval = 250,
  lifetime = 1500,
  minSize = 8,
  maxSize = 16,
  padX = 5,
  padY = 10,
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; size: number }[]>([]);
  const history = useRef<{ left: number; top: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      let left: number, top: number, attempts = 0;
      do {
        left = padX + Math.random() * (100 - padX * 2);
        top = padY + Math.random() * (100 - padY * 2);
        attempts++;
      } while (
        attempts < 20 &&
        history.current.some((h) => Math.abs(h.left - left) < 15 && Math.abs(h.top - top) < 15)
      );
      history.current.push({ left, top });
      if (history.current.length > 5) history.current.shift();
      const id = idRef.current++;
      const size = minSize + Math.random() * (maxSize - minSize);
      setSparkles((prev) => [...prev, { id, left, top, size }]);
      setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), lifetime);
    }, interval);
    return () => clearInterval(timer);
  }, [active, interval, lifetime, minSize, maxSize]);

  return (
    <>
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="absolute animate-twinkle pointer-events-none"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, filter: "drop-shadow(0 0 3px rgba(255,255,255,0.6))" }}
          viewBox="0 0 24 24"
          fill="rgba(255,255,255,0.9)"
        >
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
        </svg>
      ))}
    </>
  );
}

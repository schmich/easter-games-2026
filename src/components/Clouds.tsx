import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { images } from "../assets";

const CLOUD_SRCS = images.clouds;
const MIN_COUNT = 5;
const MAX_COUNT = 7;
const SPAWN_INTERVAL = 2000;
const MIN_SPEED = 0.2;
const MAX_SPEED = 0.5;
const HEADER_HEIGHT = 56;

// Measure natural dimensions of each cloud image once loaded
const cloudSizes: { width: number; height: number }[] = [];
const cloudSizesReady = Promise.all(
  CLOUD_SRCS.map(
    (src, i) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          cloudSizes[i] = { width: img.naturalWidth, height: img.naturalHeight };
          resolve();
        };
        img.onerror = () => {
          cloudSizes[i] = { width: 200, height: 80 };
          resolve();
        };
        img.src = src;
      })
  )
);

interface Cloud {
  id: number;
  srcIndex: number;
  x: number;
  yPct: number;
  width: number;
  height: number;
  speed: number;
  direction: 1 | -1;
}

let nextId = 0;

function randomYPct() {
  return Math.random() * 100;
}

function yPctToPx(pct: number) {
  const bandHeight = window.innerHeight * 0.75 - HEADER_HEIGHT;
  if (bandHeight <= 0) return HEADER_HEIGHT;
  return HEADER_HEIGHT + (pct / 100) * bandHeight;
}

function cloudWidth(srcIndex: number): number {
  return cloudSizes[srcIndex]?.width ?? 200;
}

function cloudHeight(srcIndex: number): number {
  return cloudSizes[srcIndex]?.height ?? 80;
}

/** Try to find a yPct that doesn't overlap existing clouds vertically. */
function findNonOverlappingYPct(existing: Cloud[], h: number, maxAttempts = 20): number {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const yPct = randomYPct();
    const top = yPctToPx(yPct);
    const bottom = top + h;
    const overlaps = existing.some((c) => {
      const cTop = yPctToPx(c.yPct);
      const cBottom = cTop + c.height;
      return top < cBottom && bottom > cTop;
    });
    if (!overlaps) return yPct;
  }
  return randomYPct();
}

export default function Clouds({ inline }: { inline?: boolean } = {}) {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [ready, setReady] = useState(false);
  const cloudsRef = useRef(clouds);
  cloudsRef.current = clouds;
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const spawnTimerRef = useRef(0);

  useEffect(() => {
    cloudSizesReady.then(() => setReady(true));
  }, []);

  const spawnCloud = useCallback(() => {
    const current = cloudsRef.current;
    const target = MIN_COUNT + Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1));
    if (current.length >= target) return;

    const usedIndices = new Set(current.map((c) => c.srcIndex));
    const available = CLOUD_SRCS.map((_, i) => i).filter((i) => !usedIndices.has(i));
    if (available.length === 0) return;

    const srcIndex = available[Math.floor(Math.random() * available.length)];
    const w = cloudWidth(srcIndex);
    const h = cloudHeight(srcIndex);
    const direction = (Math.random() < 0.5 ? 1 : -1) as 1 | -1;
    const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    const yPct = findNonOverlappingYPct(current, h);
    const x = direction === 1 ? -w : window.innerWidth;

    setClouds((prev) => [
      ...prev,
      { id: nextId++, srcIndex, x, yPct, width: w, height: h, speed, direction },
    ]);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Seed initial clouds spread across screen
    const initial: Cloud[] = [];
    const usedIndices = new Set<number>();
    const initialCount = MIN_COUNT + Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1));
    for (let i = 0; i < initialCount; i++) {
      const available = CLOUD_SRCS.map((_, idx) => idx).filter((idx) => !usedIndices.has(idx));
      if (available.length === 0) break;
      const srcIndex = available[Math.floor(Math.random() * available.length)];
      usedIndices.add(srcIndex);
      const w = cloudWidth(srcIndex);
      const h = cloudHeight(srcIndex);
      const direction = (Math.random() < 0.5 ? 1 : -1) as 1 | -1;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      const yPct = findNonOverlappingYPct(initial, h);
      const x = (window.innerWidth / (initialCount + 1)) * (i + 1) - w / 2;
      initial.push({ id: nextId++, srcIndex, x, yPct, width: w, height: h, speed, direction });
    }
    setClouds(initial);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setClouds((prev) => {
        const next = prev
          .map((c) => ({ ...c, x: c.x + c.speed * c.direction * (dt / 16) }))
          .filter((c) => {
            if (c.direction === 1) return c.x < window.innerWidth + 10;
            return c.x > -c.width - 10;
          });
        return next;
      });

      spawnTimerRef.current += dt;
      if (spawnTimerRef.current >= SPAWN_INTERVAL) {
        spawnTimerRef.current = 0;
        spawnCloud();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [ready, spawnCloud]);

  const content = (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {clouds.map((c) => (
        <img
          key={c.id}
          src={CLOUD_SRCS[c.srcIndex]}
          alt=""
          className="absolute pointer-events-none"
          style={{
            left: c.x,
            top: yPctToPx(c.yPct),
            width: c.width,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );

  return inline ? content : createPortal(content, document.getElementById("root")!.parentElement!);
}

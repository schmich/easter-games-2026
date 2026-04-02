import { useState, useEffect } from "react";
import { type LetterResult } from "../lib/eggdle";

interface TileProps {
  letter: string;
  result?: LetterResult;
  isCurrentRow: boolean;
  isFilled: boolean;
  reveal: boolean;
  revealDelay: number;
  bounce: boolean;
  bounceDelay: number;
}

const resultColors: Record<LetterResult, string> = {
  correct: "#5aad55",   // pastel green
  present: "#f6c443",   // pastel yellow/gold
  absent: "#8e919e",    // soft gray
};

export default function Tile({
  letter,
  result,
  isCurrentRow,
  isFilled,
  reveal,
  revealDelay,
  bounce,
  bounceDelay,
}: TileProps) {
  const [revealed, setRevealed] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const [pop, setPop] = useState(false);

  // Trigger pop animation when letter is typed
  useEffect(() => {
    if (isCurrentRow && isFilled) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 100);
      return () => clearTimeout(t);
    }
  }, [isCurrentRow, isFilled, letter]);

  // Trigger flip reveal animation
  useEffect(() => {
    if (!reveal || !result) return;
    const t1 = setTimeout(() => setFlipping(true), revealDelay);
    // Apply color at halfway point (tile is edge-on)
    const t2 = setTimeout(() => setRevealed(true), revealDelay + 250);
    const t3 = setTimeout(() => setFlipping(false), revealDelay + 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reveal, result, revealDelay]);

  // Trigger bounce animation on win
  useEffect(() => {
    if (!bounce) return;
    const t = setTimeout(() => setBouncing(true), bounceDelay);
    return () => clearTimeout(t);
  }, [bounce, bounceDelay]);

  const bgColor = revealed && result ? resultColors[result] : "#ffffff";
  const borderColor =
    revealed && result
      ? resultColors[result]
      : isFilled
        ? "#adb5c7"
        : "#d3d6da";
  const textColor = revealed && result ? "#ffffff" : "#1a1a2e";

  return (
    <div
      className={`
        w-[62px] h-[62px] flex items-center justify-center
        text-[2rem] uppercase leading-none
        border-2 box-border
        ${pop ? "scale-[1.08]" : "scale-100"}
        ${flipping ? "animate-flip-in" : ""}
        ${bouncing ? "animate-bounce-tile" : ""}
      `}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        transition: pop ? "transform 100ms ease-in-out" : undefined,
      }}
    >
      {letter}
    </div>
  );
}

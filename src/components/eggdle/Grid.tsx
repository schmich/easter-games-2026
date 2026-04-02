import { type LetterResult } from "../../lib/eggdle";
import Tile from "./Tile";

interface GridProps {
  guesses: string[];
  results: LetterResult[][];
  currentGuess: string;
  maxGuesses: number;
  wordLength: number;
  shakeRow: number;
  revealRow: number;
  bounceRow: number;
  won: boolean;
}

export default function Grid({
  guesses,
  results,
  currentGuess,
  maxGuesses,
  wordLength,
  shakeRow,
  revealRow,
  bounceRow,
}: GridProps) {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    const isCurrentRow = i === guesses.length;
    const isSubmitted = i < guesses.length;
    const letters = isSubmitted
      ? guesses[i].split("")
      : isCurrentRow
        ? currentGuess.padEnd(wordLength, " ").split("").slice(0, wordLength)
        : new Array(wordLength).fill("");

    const rowResults = isSubmitted ? results[i] : undefined;
    const shouldShake = shakeRow === i;
    const shouldReveal = revealRow === i;
    const shouldBounce = bounceRow === i;

    rows.push(
      <div
        key={i}
        className={`flex gap-[5px] ${shouldShake ? "animate-shake" : ""}`}
      >
        {letters.map((letter, j) => (
          <Tile
            key={j}
            letter={letter === " " ? "" : letter}
            result={rowResults?.[j]}
            isCurrentRow={isCurrentRow}
            isFilled={letter !== "" && letter !== " "}
            reveal={shouldReveal}
            revealDelay={j * 350}
            bounce={shouldBounce}
            bounceDelay={j * 100}
          />
        ))}
      </div>
    );
  }

  return <div className="flex flex-col gap-[5px]">{rows}</div>;
}

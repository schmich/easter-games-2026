import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import Header from "../Header";
import Toast from "../Toast";
import SuccessDialog from "./SuccessDialog";
import FailureDialog from "./FailureDialog";
import GameIntroDialog from "./GameIntroDialog";
import { evaluateGuess, type LetterResult } from "../../lib/eggdle";
import { isValidWord } from "../../lib/words";
import { audio, images } from "../../assets";

const MAX_GUESSES = 6;

interface EggdleProps {
  targetWord: string;
}

export default function Eggdle({ targetWord }: EggdleProps) {
  const navigate = useNavigate();
  const word = targetWord.toUpperCase();
  const wordLength = word.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState(-1);
  const [revealRow, setRevealRow] = useState(-1);
  const [bounceRow, setBounceRow] = useState(-1);
  const [revealedCount, setRevealedCount] = useState(0);
  const revealingRef = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showIntro, setShowIntro] = useState(
    () => !localStorage.getItem("eggdle-intro-seen")
  );

  const handleRetry = useCallback(() => {
    setGuesses([]);
    setResults([]);
    setCurrentGuess("");
    setGameOver(false);
    setWon(false);
    setToast(null);
    setShakeRow(-1);
    setRevealRow(-1);
    setBounceRow(-1);
    setRevealedCount(0);
    revealingRef.current = false;
    setShowSuccess(false);
    setShowFailure(false);
    setGameKey((k) => k + 1);
  }, []);

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      showToast("Not enough letters");
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(-1), 600);
      return;
    }

    if (!isValidWord(currentGuess)) {
      showToast("Not in word list");
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(-1), 600);
      return;
    }

    if (guesses.includes(currentGuess)) {
      showToast("Already guessed");
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(-1), 600);
      return;
    }

    const result = evaluateGuess(currentGuess, word);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, result];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess("");
    setRevealRow(newGuesses.length - 1);
    revealingRef.current = true;

    const isWin = result.every((r) => r === "correct");
    const isLoss = newGuesses.length >= MAX_GUESSES && !isWin;

    // Delay until all tiles in the row have finished flipping
    const revealDuration = wordLength * 350 + 500;

    // Update keyboard colors only after full row reveal
    setTimeout(() => {
      setRevealedCount(newGuesses.length);
      revealingRef.current = false;
    }, revealDuration);

    if (isWin) {
      setTimeout(() => {
        setBounceRow(newGuesses.length - 1);
        setWon(true);
        setGameOver(true);
        audio.applause.currentTime = 0;
        audio.applause.play();
      }, revealDuration);
      // Show success dialog after bounce animation finishes
      setTimeout(() => {
        setShowSuccess(true);
      }, revealDuration + 1200);
    } else if (isLoss) {
      setTimeout(() => {
        setGameOver(true);
      }, revealDuration);
      setTimeout(() => {
        setShowFailure(true);
      }, revealDuration + 500);
    }
  }, [currentGuess, guesses, results, word, wordLength, showToast]);

  const onKey = useCallback(
    (key: string) => {
      if (gameOver || revealingRef.current) return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [gameOver, submitGuess, currentGuess.length, wordLength]
  );

  // Physical keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        onKey("ENTER");
      } else if (e.key === "Backspace") {
        onKey("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKey(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  // Build keyboard color map — only include fully revealed rows
  const letterStates = new Map<string, LetterResult>();
  for (let gi = 0; gi < revealedCount; gi++) {
    const guess = guesses[gi];
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const result = results[gi][i];
      const current = letterStates.get(letter);
      // Priority: correct > present > absent
      if (
        result === "correct" ||
        (result === "present" && current !== "correct") ||
        (result === "absent" && !current)
      ) {
        letterStates.set(letter, result);
      }
    }
  }

  return (
    <>
      <img
        src={images.eggsGrass}
        alt=""
        className="absolute bottom-[160px] left-0 w-[180px] opacity-80 pointer-events-none z-[1]"
      />
      <img
        src={images.grassBasket}
        alt=""
        className="absolute bottom-[120px] right-0 w-[160px] opacity-80 pointer-events-none z-[1]"
      />
      <Header title="Eggdle" />
      <Toast message={toast} />
      <div className="flex flex-col items-center justify-between flex-1 overflow-hidden relative z-10">
        <div className="flex items-center justify-center flex-1 w-full">
          <Grid
            key={gameKey}
            guesses={guesses}
            results={results}
            currentGuess={currentGuess}
            maxGuesses={MAX_GUESSES}
            wordLength={wordLength}
            shakeRow={shakeRow}
            revealRow={revealRow}
            bounceRow={bounceRow}
            won={won}
          />
        </div>
        <Keyboard onKey={onKey} letterStates={letterStates} disabled={gameOver} />
      </div>

      <SuccessDialog
        isOpen={showSuccess}
        onOpenChange={setShowSuccess}
        guessCount={guesses.length}
        onNext={() => navigate("/conneggtions")}
      />

      <FailureDialog
        isOpen={showFailure}
        onRetry={handleRetry}
      />

      <GameIntroDialog
        isOpen={showIntro}
        onClose={() => {
          localStorage.setItem("eggdle-intro-seen", "1");
          setShowIntro(false);
        }}
        image={images.eggfather}
        title="Eggdle"
        description="Little do people know, The Eggfather is quite the wordsmith. See if you can crack his secret word."
      />
    </>
  );
}

import { useState, useCallback } from "react";
import { Button } from "@heroui/react";
import Header from "../Header";
import Toast from "../Toast";
import ConnectionsGrid from "./ConnectionsGrid";
import SolvedGroup from "./SolvedGroup";
import MistakeIndicator from "./MistakeIndicator";
import ConnectionsEndDialog from "./ConnectionsEndDialog";
import { PUZZLE } from "../../lib/connectionsData";
import type { ConnectionsGroup } from "../../lib/connectionsData";
import { checkGuess, shuffleWords } from "../../lib/connections";
import { audio } from "../../assets";

export default function Connections() {
  const [remainingWords, setRemainingWords] = useState<string[]>(() =>
    shuffleWords(PUZZLE.groups.flatMap((g) => g.words))
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionsGroup[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shakeSelected, setShakeSelected] = useState(false);
  const [bouncingWords, setBouncingWords] = useState<string[]>([]);
  const [shrinkingWords, setShrinkingWords] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [gameKey, setGameKey] = useState(0);

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const handleToggle = useCallback(
    (word: string) => {
      if (gameOver || animating) return;
      setSelectedWords((prev) => {
        if (prev.includes(word)) {
          return prev.filter((w) => w !== word);
        }
        if (prev.length >= 4) return prev;
        return [...prev, word];
      });
    },
    [gameOver, animating]
  );

  const handleRetry = useCallback(() => {
    setRemainingWords(shuffleWords(PUZZLE.groups.flatMap((g) => g.words)));
    setSelectedWords([]);
    setSolvedGroups([]);
    setMistakesRemaining(4);
    setGameOver(false);
    setWon(false);
    setToast(null);
    setShakeSelected(false);
    setBouncingWords([]);
    setShrinkingWords([]);
    setAnimating(false);
    setPreviousGuesses([]);
    setGameKey((k) => k + 1);
  }, []);

  const handleShuffle = useCallback(() => {
    setRemainingWords((prev) => shuffleWords(prev));
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedWords.length !== 4 || gameOver || animating) return;

    const guessKey = [...selectedWords].sort().join(",");
    if (previousGuesses.includes(guessKey)) {
      showToast("Already guessed");
      setShakeSelected(true);
      setTimeout(() => setShakeSelected(false), 600);
      return;
    }
    setPreviousGuesses((prev) => [...prev, guessKey]);

    const result = checkGuess(selectedWords, PUZZLE);

    if (result.correct && result.group) {
      const group = result.group;
      const words = [...selectedWords];
      setAnimating(true);

      // Phase 1: Bounce selected tiles (staggered, ~600ms total)
      setBouncingWords(words);

      // Phase 2: Shrink tiles away after bounce
      setTimeout(() => {
        setBouncingWords([]);
        setShrinkingWords(words);
      }, 600);

      // Phase 3: Remove tiles, reveal solved group with pulse
      setTimeout(() => {
        setShrinkingWords([]);
        setSelectedWords([]);
        setRemainingWords((prev) =>
          prev.filter((w) => !group.words.includes(w))
        );
        const newSolved = [...solvedGroups, group];
        setSolvedGroups(newSolved);
        setAnimating(false);

        if (newSolved.length === 4) {
          setWon(true);
          setGameOver(true);
          audio.applause.currentTime = 0;
          audio.applause.play();
        }
      }, 900);
    } else {
      // Wrong guess
      setShakeSelected(true);
      setTimeout(() => setShakeSelected(false), 600);

      if (result.oneAway) {
        showToast("One away!");
      }

      const newMistakes = mistakesRemaining - 1;
      setMistakesRemaining(newMistakes);

      if (newMistakes === 0) {
        setTimeout(() => {
          setGameOver(true);
        }, 800);
      }
    }
  }, [selectedWords, gameOver, animating, solvedGroups, mistakesRemaining, previousGuesses, showToast]);

  return (
    <>
      <Header title="Connections" />
      <Toast message={toast} />
      <div className="flex flex-col items-center flex-1 overflow-y-auto px-4 gap-1.5" style={{ paddingTop: "10vh" }}>
        {/* Solved groups */}
        {solvedGroups.map((group) => (
          <SolvedGroup key={group.category} group={group} />
        ))}

        {/* Remaining word grid */}
        {remainingWords.length > 0 && (
          <ConnectionsGrid
            key={gameKey}
            words={remainingWords}
            selectedWords={selectedWords}
            onToggle={handleToggle}
            shake={shakeSelected}
            bouncingWords={bouncingWords}
            shrinkingWords={shrinkingWords}
          />
        )}

        {/* Mistake indicator */}
        <MistakeIndicator remaining={mistakesRemaining} />

        {/* Action buttons */}
        {!gameOver && (
          <div className="flex gap-3 mt-1">
            <Button
              onPress={handleShuffle}
              className="border border-[#6b4c8a] text-[#6b4c8a] bg-transparent rounded-full px-5 py-2 text-base font-medium cursor-pointer hover:bg-[#6b4c8a]/10 transition-colors"
            >
              Shuffle
            </Button>
            <Button
              onPress={handleDeselect}
              className="border border-[#6b4c8a] text-[#6b4c8a] bg-transparent rounded-full px-5 py-2 text-base font-medium cursor-pointer hover:bg-[#6b4c8a]/10 transition-colors"
            >
              Deselect All
            </Button>
            <Button
              onPress={handleSubmit}
              isDisabled={selectedWords.length !== 4}
              className={`rounded-full px-5 py-2 text-base font-medium transition-colors cursor-pointer ${
                selectedWords.length === 4
                  ? "bg-[#6b4c8a] text-white hover:bg-[#5a3d78]"
                  : "bg-[#6b4c8a]/30 text-white/50 cursor-not-allowed"
              }`}

            >
              Submit
            </Button>
          </div>
        )}
      </div>

      <ConnectionsEndDialog
        isOpen={gameOver}
        won={won}
        solvedGroups={solvedGroups}
        mistakesRemaining={mistakesRemaining}
        onRetry={handleRetry}
      />
    </>
  );
}

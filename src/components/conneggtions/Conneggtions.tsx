import { useState, useCallback, useEffect } from "react";
import { Button } from "@heroui/react";
import Header from "../Header";
import Toast from "../Toast";
import Grid from "./Grid";
import SolvedGroup from "./SolvedGroup";
import MistakeIndicator from "./MistakeIndicator";
import EndDialog from "./EndDialog";
import GameIntroDialog from "../GameIntroDialog";
import Decorations from "../Decorations";
import Clouds from "../Clouds";
import { PUZZLE } from "../../lib/conneggtionsData";
import type { ConneggtionsGroup } from "../../lib/conneggtionsData";
import { checkGuess, shuffleWords } from "../../lib/conneggtions";
import { images, audio, playMissedAudio, playClick, playClap, playLoseAudio, stopAllVoices } from "../../assets";
import { hasSeenIntro, markIntroSeen } from "../../lib/introState";

export default function Conneggtions() {
  const [remainingWords, setRemainingWords] = useState<string[]>(() =>
    shuffleWords(PUZZLE.groups.flatMap((g) => g.words))
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConneggtionsGroup[]>([]);
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
  const [showIntro, setShowIntro] = useState(
    () => !hasSeenIntro("conneggtions")
  );

  useEffect(() => {
    if (showIntro) {
      audio.announcerConneggtions.currentTime = 0;
      audio.announcerConneggtions.play();
    }
  }, [showIntro]);

  const showToast = useCallback((msg: string, duration = 1500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const handleToggle = useCallback(
    (word: string) => {
      if (gameOver || animating) return;
      setSelectedWords((prev) => {
        if (prev.includes(word)) {
          playClick();
          return prev.filter((w) => w !== word);
        }
        if (prev.length >= 4) return prev;
        playClick();
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

      // Play clap during animation
      setTimeout(() => {
        playClap();
      }, 100);

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

        // Play corresponding Buggsy audio for each solved group
        const groupAudio = [audio.buggsyConneggtions1, audio.buggsyConneggtions2, audio.buggsyConneggtions3];
        const clip = groupAudio[newSolved.length - 1];
        if (clip) {
          clip.currentTime = 0;
          clip.play();
        }

        if (newSolved.length === 4) {
          setWon(true);
          setGameOver(true);
          audio.buggsyConneggtionsWin.currentTime = 0;
          audio.buggsyConneggtionsWin.play();
        }
      }, 900);
    } else {
      // Wrong guess
      setShakeSelected(true);
      setTimeout(() => setShakeSelected(false), 600);
      playMissedAudio();

      if (result.oneAway) {
        showToast("One away!");
      }

      const newMistakes = mistakesRemaining - 1;
      setMistakesRemaining(newMistakes);

      if (newMistakes === 0) {
        setTimeout(() => {
          setGameOver(true);
          playLoseAudio();
        }, 800);
      }
    }
  }, [selectedWords, gameOver, animating, solvedGroups, mistakesRemaining, previousGuesses, showToast]);

  return (
    <>
      <Clouds />
      <Decorations
        topLeft={{ src: images.peepChick, className: "top-[60px] w-[140px]", style: { left: "-5%" } }}
        topRight={{ src: images.peepBunny, className: "top-[70px] w-[120px]", style: { right: "-5%" } }}
        bottomLeft={{ src: images.goldBunnyLeft, className: "h-[300px] w-auto", style: { bottom: "60px", left: "-40px" }, sparkle: true, belowGrass: true }}
        bottomRight={{ src: images.goldBunnyRight, className: "h-[300px] w-auto", style: { bottom: "60px", right: "-40px" }, sparkle: true, belowGrass: true }}
      />
      <Header title="Conneggtions" />
      <Toast message={toast} />
      <div className="flex flex-col items-center flex-1 overflow-y-auto px-4 gap-1.5 relative z-10" style={{ paddingTop: "10vh" }}>
        {/* Solved groups */}
        {solvedGroups.map((group) => (
          <SolvedGroup key={group.category} group={group} />
        ))}

        {/* Remaining word grid */}
        {remainingWords.length > 0 && (
          <Grid
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
              className="bg-gradient-to-b from-[#e8d5f0] to-[#d4b8e8] text-[#6b4c8a] rounded-full px-5 py-2 text-base font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              Shuffle
            </Button>
            <Button
              onPress={handleDeselect}
              className="bg-gradient-to-b from-[#e8d5f0] to-[#d4b8e8] text-[#6b4c8a] rounded-full px-5 py-2 text-base font-medium cursor-pointer hover:opacity-90 transition-opacity"
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

      <EndDialog
        isOpen={gameOver}
        won={won}
        solvedGroups={solvedGroups}
        mistakesRemaining={mistakesRemaining}
        onRetry={handleRetry}
      />

      <GameIntroDialog
        isOpen={showIntro}
        onClose={() => {
          stopAllVoices();
          markIntroSeen("conneggtions");
          setShowIntro(false);
        }}
        image={images.buggsyConneggtionsIntro}
        title="Conneggtions"
        description="Buggsy likes to scramble things up. Nothing over easy here. Find the four baskets of conneggtions among the sixteen words, if you can."
      />
    </>
  );
}

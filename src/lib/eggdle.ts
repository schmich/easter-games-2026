export type LetterResult = "correct" | "present" | "absent";

export function evaluateGuess(guess: string, target: string): LetterResult[] {
  const result: LetterResult[] = new Array(guess.length).fill("absent");
  const targetChars = target.split("");
  const remaining: (string | null)[] = [...targetChars];

  // First pass: mark correct letters
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      remaining[idx] = null;
    }
  }

  return result;
}

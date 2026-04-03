import { type LetterResult } from "../../lib/eggdle";

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStates: Map<string, LetterResult>;
  disabled?: boolean;
  canSubmit?: boolean;
  canBackspace?: boolean;
}

const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const resultColors: Record<LetterResult, string> = {
  correct: "#5aad55",
  present: "#f6c443",
  absent: "#8e919e",
};

const resultTextColors: Record<LetterResult, string> = {
  correct: "#ffffff",
  present: "#ffffff",
  absent: "#ffffff",
};

export default function Keyboard({ onKey, letterStates, disabled, canSubmit = true, canBackspace = true }: KeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-[4px] pb-2 px-2 w-full max-w-[500px] mx-auto mb-1">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-[3px] w-full justify-center">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            const isEnterDisabled = key === "ENTER" && !canSubmit;
            const isBackspaceDisabled = key === "BACKSPACE" && !canBackspace;
            const isKeyDisabled = isEnterDisabled || isBackspaceDisabled;
            const state = letterStates.get(key);
            const bg = isKeyDisabled ? "#e8e8e8" : state ? resultColors[state] : "#ffffff";
            const textColor = isKeyDisabled ? "#b0b0b0" : state ? resultTextColors[state] : "#1a1a2e";

            return (
              <button
                key={key}
                onPointerDown={(e) => { e.preventDefault(); !isKeyDisabled && onKey(key); }}
                className={`
                  flex items-center justify-center rounded-[4px] border border-[#d3d6da]
                  h-[58px] select-none
                  ${disabled || isKeyDisabled ? "cursor-default" : "cursor-pointer active:opacity-70"}
                  ${isWide ? "text-base px-1 flex-[1.5]" : "text-[1.3rem] flex-1"}
                `}
                style={{
                  backgroundColor: bg,
                  color: textColor,
                  maxWidth: isWide ? "65.4px" : "43px",
                  minWidth: isWide ? "65.4px" : undefined,
                }}
              >
                {key === "BACKSPACE" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill={textColor}
                  >
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

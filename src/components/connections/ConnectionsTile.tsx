interface ConnectionsTileProps {
  word: string;
  isSelected: boolean;
  onToggle: () => void;
  shake: boolean;
  bounce: boolean;
  bounceDelay: number;
  shrink: boolean;
}

export default function ConnectionsTile({
  word,
  isSelected,
  onToggle,
  shake,
  bounce,
  bounceDelay,
  shrink,
}: ConnectionsTileProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        h-[60px] rounded-lg flex items-center justify-center
        uppercase cursor-pointer transition-all duration-150
        ${isSelected ? "bg-[#6b4c8a] text-white scale-[1.03]" : "bg-[#e8d5f0] text-[#1a1a2e]"}
        ${shake ? "animate-shake" : ""}
        ${bounce ? "animate-bounce-pop" : ""}
        ${shrink ? "animate-shrink-away" : ""}
      `}
      style={{
        fontSize: word.length > 7 ? "0.85rem" : "1rem",
        animationDelay: bounce ? `${bounceDelay}ms` : undefined,
        animationFillMode: bounce || shrink ? "both" : undefined,
      }}
    >
      {word}
    </button>
  );
}

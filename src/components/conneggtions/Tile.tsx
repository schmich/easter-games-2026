interface TileProps {
  word: string;
  isSelected: boolean;
  onToggle: () => void;
  shake: boolean;
  bounce: boolean;
  bounceDelay: number;
  shrink: boolean;
}

export default function Tile({
  word,
  isSelected,
  onToggle,
  shake,
  bounce,
  bounceDelay,
  shrink,
}: TileProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        h-[68px] rounded-lg flex items-center justify-center
        uppercase cursor-pointer transition-all duration-150
        ${isSelected ? "bg-[#6b4c8a] text-white scale-[1.03]" : "bg-[#e8d5f0] text-[#1a1a2e]"}
        ${shake ? "animate-shake" : ""}
        ${bounce ? "animate-bounce-pop" : ""}
        ${shrink ? "animate-shrink-away" : ""}
      `}
      style={{
        fontSize: word.length > 7 ? "1rem" : "1.15rem",
        animationDelay: bounce ? `${bounceDelay}ms` : undefined,
        animationFillMode: bounce || shrink ? "both" : undefined,
      }}
    >
      {word}
    </button>
  );
}

interface TileProps {
  word: string;
  isSelected: boolean;
  onToggle: () => void;
  shake: boolean;
  bounce: boolean;
  bounceDelay: number;
  shrink: boolean;
  gridIndex: number;
  gridTotal: number;
}

export default function Tile({
  word,
  isSelected,
  onToggle,
  shake,
  bounce,
  bounceDelay,
  shrink,
  gridIndex,
  gridTotal,
}: TileProps) {
  const row = Math.floor(gridIndex / 4);
  const col = gridIndex % 4;
  const totalRows = Math.ceil(gridTotal / 4);
  const t = (col / 3 + row / Math.max(totalRows - 1, 1)) / 2;
  return (
    <button
      onClick={onToggle}
      className={`
        h-[68px] rounded-lg flex items-center justify-center relative overflow-hidden
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
      {!isSelected && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            backgroundColor: `rgba(176,127,208,${0.05 + t * 0.45})`,
          }}
        />
      )}
      <span className="relative z-[1]">{word}</span>
    </button>
  );
}

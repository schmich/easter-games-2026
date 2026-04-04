import React from "react";
import { createPortal } from "react-dom";
import Sparkles from "./Sparkles";

interface DecorationItem {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  sparkle?: boolean;
  belowGrass?: boolean;
}

interface DecorationsProps {
  topLeft?: DecorationItem;
  topRight?: DecorationItem;
  bottomLeft?: DecorationItem;
  bottomRight?: DecorationItem;
}

function DecorationImg({ src, className, style, sparkle }: DecorationItem & { className: string; style?: React.CSSProperties }) {
  if (sparkle) {
    return (
      <div className={className} style={style}>
        <img src={src} alt="" className="w-full h-full object-contain" />
        <Sparkles active interval={150} minSize={6} maxSize={14} />
      </div>
    );
  }
  return <img src={src} alt="" className={className} style={style} />;
}

export default function Decorations({ topLeft, topRight, bottomLeft, bottomRight }: DecorationsProps) {
  return (
    <>
      {topLeft && (
        <DecorationImg
          {...topLeft}
          className={`fixed pointer-events-none z-0 animate-wobble-float ${topLeft.className ?? ""}`}
          style={{ "--wobble-base": "-8deg", ...topLeft.style } as React.CSSProperties}
        />
      )}
      {topRight && (
        <DecorationImg
          {...topRight}
          className={`fixed pointer-events-none z-0 animate-wobble-float ${topRight.className ?? ""}`}
          style={{ "--wobble-base": "8deg", animationDelay: "-4s", ...topRight.style } as React.CSSProperties}
        />
      )}
      {bottomLeft && (bottomLeft.belowGrass
        ? createPortal(
            <DecorationImg {...bottomLeft} className={`fixed pointer-events-none z-[2] ${bottomLeft.className ?? ""}`} style={bottomLeft.style} />,
            document.getElementById("root")!.parentElement!
          )
        : <DecorationImg {...bottomLeft} className={`fixed pointer-events-none z-[2] ${bottomLeft.className ?? ""}`} style={bottomLeft.style} />
      )}
      {bottomRight && (bottomRight.belowGrass
        ? createPortal(
            <DecorationImg {...bottomRight} className={`fixed pointer-events-none z-[2] ${bottomRight.className ?? ""}`} style={bottomRight.style} />,
            document.getElementById("root")!.parentElement!
          )
        : <DecorationImg {...bottomRight} className={`fixed pointer-events-none z-[2] ${bottomRight.className ?? ""}`} style={bottomRight.style} />
      )}
    </>
  );
}

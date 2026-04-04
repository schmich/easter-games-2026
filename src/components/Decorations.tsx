import React from "react";

interface DecorationItem {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

interface DecorationsProps {
  topLeft?: DecorationItem;
  topRight?: DecorationItem;
  bottomLeft?: DecorationItem;
  bottomRight?: DecorationItem;
}

export default function Decorations({ topLeft, topRight, bottomLeft, bottomRight }: DecorationsProps) {
  return (
    <>
      {topLeft && (
        <img
          src={topLeft.src}
          alt=""
          className={`fixed pointer-events-none z-0 animate-wobble-float ${topLeft.className ?? ""}`}
          style={{ "--wobble-base": "-8deg", ...topLeft.style } as React.CSSProperties}
        />
      )}
      {topRight && (
        <img
          src={topRight.src}
          alt=""
          className={`fixed pointer-events-none z-0 animate-wobble-float ${topRight.className ?? ""}`}
          style={{ "--wobble-base": "8deg", animationDelay: "-4s", ...topRight.style } as React.CSSProperties}
        />
      )}
      {bottomLeft && (
        <img
          src={bottomLeft.src}
          alt=""
          className={`fixed pointer-events-none z-[2] ${bottomLeft.className ?? ""}`}
          style={bottomLeft.style}
        />
      )}
      {bottomRight && (
        <img
          src={bottomRight.src}
          alt=""
          className={`fixed pointer-events-none z-[2] ${bottomRight.className ?? ""}`}
          style={bottomRight.style}
        />
      )}
    </>
  );
}

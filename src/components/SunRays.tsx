export default function SunRays() {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none animate-sun-rays"
        style={{
          width: "200vmax",
          height: "200vmax",
          background: `conic-gradient(
            from 0deg,
            transparent 0deg, rgba(246,196,67,0.4) 3deg, rgba(255,215,80,0.5) 10deg, rgba(246,196,67,0.4) 17deg, transparent 20deg,
            transparent 30deg, rgba(246,196,67,0.35) 33deg, rgba(255,215,80,0.45) 40deg, rgba(246,196,67,0.35) 47deg, transparent 50deg,
            transparent 60deg, rgba(246,196,67,0.4) 63deg, rgba(255,215,80,0.5) 70deg, rgba(246,196,67,0.4) 77deg, transparent 80deg,
            transparent 90deg, rgba(246,196,67,0.35) 93deg, rgba(255,215,80,0.45) 100deg, rgba(246,196,67,0.35) 107deg, transparent 110deg,
            transparent 120deg, rgba(246,196,67,0.4) 123deg, rgba(255,215,80,0.5) 130deg, rgba(246,196,67,0.4) 137deg, transparent 140deg,
            transparent 150deg, rgba(246,196,67,0.35) 153deg, rgba(255,215,80,0.45) 160deg, rgba(246,196,67,0.35) 167deg, transparent 170deg,
            transparent 180deg, rgba(246,196,67,0.4) 183deg, rgba(255,215,80,0.5) 190deg, rgba(246,196,67,0.4) 197deg, transparent 200deg,
            transparent 210deg, rgba(246,196,67,0.35) 213deg, rgba(255,215,80,0.45) 220deg, rgba(246,196,67,0.35) 227deg, transparent 230deg,
            transparent 240deg, rgba(246,196,67,0.4) 243deg, rgba(255,215,80,0.5) 250deg, rgba(246,196,67,0.4) 257deg, transparent 260deg,
            transparent 270deg, rgba(246,196,67,0.35) 273deg, rgba(255,215,80,0.45) 280deg, rgba(246,196,67,0.35) 287deg, transparent 290deg,
            transparent 300deg, rgba(246,196,67,0.4) 303deg, rgba(255,215,80,0.5) 310deg, rgba(246,196,67,0.4) 317deg, transparent 320deg,
            transparent 330deg, rgba(246,196,67,0.35) 333deg, rgba(255,215,80,0.45) 340deg, rgba(246,196,67,0.35) 347deg, transparent 350deg,
            transparent 360deg
          )`,
          borderRadius: "50%",
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none animate-sun-rays animate-shimmer"
        style={{
          width: "200vmax",
          height: "200vmax",
          animationDuration: "27s, 4s",
          animationDelay: "-5s, -1s",
          background: `conic-gradient(
            from 15deg,
            transparent 0deg, rgba(255,215,80,0.35) 2deg, rgba(246,196,67,0.45) 8deg, rgba(255,215,80,0.35) 14deg, transparent 16deg,
            transparent 30deg, rgba(255,215,80,0.3) 32deg, rgba(246,196,67,0.4) 38deg, rgba(255,215,80,0.3) 44deg, transparent 46deg,
            transparent 60deg, rgba(255,215,80,0.35) 62deg, rgba(246,196,67,0.45) 68deg, rgba(255,215,80,0.35) 74deg, transparent 76deg,
            transparent 90deg, rgba(255,215,80,0.3) 92deg, rgba(246,196,67,0.4) 98deg, rgba(255,215,80,0.3) 104deg, transparent 106deg,
            transparent 120deg, rgba(255,215,80,0.35) 122deg, rgba(246,196,67,0.45) 128deg, rgba(255,215,80,0.35) 134deg, transparent 136deg,
            transparent 150deg, rgba(255,215,80,0.3) 152deg, rgba(246,196,67,0.4) 158deg, rgba(255,215,80,0.3) 164deg, transparent 166deg,
            transparent 180deg, rgba(255,215,80,0.35) 182deg, rgba(246,196,67,0.45) 188deg, rgba(255,215,80,0.35) 194deg, transparent 196deg,
            transparent 210deg, rgba(255,215,80,0.3) 212deg, rgba(246,196,67,0.4) 218deg, rgba(255,215,80,0.3) 224deg, transparent 226deg,
            transparent 240deg, rgba(255,215,80,0.35) 242deg, rgba(246,196,67,0.45) 248deg, rgba(255,215,80,0.35) 254deg, transparent 256deg,
            transparent 270deg, rgba(255,215,80,0.3) 272deg, rgba(246,196,67,0.4) 278deg, rgba(255,215,80,0.3) 284deg, transparent 286deg,
            transparent 300deg, rgba(255,215,80,0.35) 302deg, rgba(246,196,67,0.45) 308deg, rgba(255,215,80,0.35) 314deg, transparent 316deg,
            transparent 330deg, rgba(255,215,80,0.3) 332deg, rgba(246,196,67,0.4) 338deg, rgba(255,215,80,0.3) 344deg, transparent 346deg,
            transparent 360deg
          )`,
          borderRadius: "50%",
          filter: "blur(6px)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none animate-shimmer"
        style={{
          width: "500px",
          height: "500px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(246,196,67,0.6) 0%, rgba(255,215,80,0.3) 35%, transparent 65%)",
          borderRadius: "50%",
        }}
      />
    </>
  );
}

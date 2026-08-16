import { BURST_DIRS } from "../../lib/theme.js";

export default function Impact({ fx }) {
  if (!fx || fx.key === 0) return null;
  const isCrit = fx.type === "crit";
  const ringColor = isCrit ? "#fbbf24" : "#94a3b8";
  const pColor = isCrit ? "#fde68a" : "#cbd5e1";

  return (
    <div key={fx.key} className="absolute inset-0 pointer-events-none">
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: 90,
          height: 90,
          marginLeft: -45,
          marginTop: -45,
          borderRadius: "9999px",
          border: `3px solid ${ringColor}`,
          animation: "ring .5s ease-out forwards",
        }}
      />
      {isCrit && (
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "44%",
            width: 190,
            height: 12,
            marginLeft: -95,
            borderRadius: 9999,
            background: "linear-gradient(90deg,transparent,#ffffff,transparent)",
            animation: "slash .4s ease-out forwards",
          }}
        />
      )}
      {BURST_DIRS.map(([tx, ty], i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: isCrit ? 9 : 6,
            height: isCrit ? 9 : 6,
            borderRadius: "9999px",
            background: pColor,
            "--tx": `${isCrit ? tx : tx * 0.65}px`,
            "--ty": `${isCrit ? ty : ty * 0.65}px`,
            animation: "burst .6s ease-out forwards",
          }}
        />
      ))}
      <span
        className="absolute font-black"
        style={{
          left: "50%",
          top: "36%",
          fontSize: isCrit ? 32 : 20,
          color: isCrit ? "#fbbf24" : "#94a3b8",
          textShadow: "0 2px 6px rgba(0,0,0,.6)",
          animation: "dmgFly .9s ease-out forwards",
        }}
      >
        {isCrit ? `-${fx.dmg}` : "MISS"}
      </span>
    </div>
  );
}

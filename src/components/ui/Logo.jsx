import Emblem from "./Emblem.jsx";

export default function Logo({ scale = 1, row = false }) {
  const under = 208 * scale;
  return (
    <div className={row ? "flex items-center gap-3" : "flex flex-col items-center"}>
      <Emblem size={64 * scale} />
      <div className={row ? "" : "text-center mt-2"}>
        <div
          className="font-bold text-emerald-300"
          style={{
            fontSize: 13 * scale,
            letterSpacing: "0.42em",
            paddingLeft: "0.42em",
            textShadow: "0 0 10px rgba(52,211,153,.4)",
          }}
        >
          LEGACY
        </div>
        <div
          className="font-black"
          style={{
            fontSize: 52 * scale,
            lineHeight: 0.92,
            letterSpacing: "0.02em",
            backgroundImage: "linear-gradient(100deg,#6ee7b7 10%,#fbbf24 90%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 2px 14px rgba(251,191,36,.35))",
          }}
        >
          QUEST
        </div>
        <div
          className="relative rounded-full"
          style={{
            width: under,
            height: 3,
            marginTop: 5 * scale,
            marginLeft: row ? 0 : "auto",
            marginRight: row ? 0 : "auto",
            background: "linear-gradient(90deg,#34d399,#fbbf24)",
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              top: "50%",
              left: 0,
              width: 8,
              height: 8,
              marginTop: -4,
              background: "#fff",
              boxShadow: "0 0 10px #fff",
              "--w": `${under - 8}px`,
              animation: "sweep 2.4s ease-in-out infinite alternate",
            }}
          />
        </div>
        <div
          className="font-mono text-slate-400"
          style={{ fontSize: 10.5 * scale, letterSpacing: "0.24em", marginTop: 7 * scale }}
        >
          COBOL → JAVA MIGRATION
        </div>
      </div>
    </div>
  );
}

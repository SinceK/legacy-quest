import { panelStyle, scanlines } from "../../lib/theme.js";

export default function CobolPanel({ code, label = "COBOL 巻物" }) {
  return (
    <div className="cobol-scroll relative rounded-xl p-4 overflow-hidden" style={panelStyle}>
      <div className="absolute inset-0 pointer-events-none rounded-lg" style={scanlines} />
      <div className="relative flex items-center gap-2 mb-2 text-emerald-300 text-xs uppercase tracking-widest">
        <span>▍{label}</span>
      </div>
      <pre className="relative text-sm leading-6 whitespace-pre-wrap">
        {code}
        <span style={{ animation: "blink 1s step-end infinite" }}>▊</span>
      </pre>
    </div>
  );
}

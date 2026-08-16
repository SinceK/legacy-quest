/**
 * 映画フィルム風の粒状ノイズ。SVGのfeTurbulenceを1枚のタイル画像として焼き込み、
 * background-positionを小刻みにずらすだけで粒子が明滅しているように見せる。
 * DOM要素を増やさず軽量なまま「映像っぽい質感」を足せる。
 */
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter>" +
      "<rect width='100%' height='100%' filter='url(#n)'/></svg>",
  );

export default function FilmGrain({ opacity = 0.05 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage: `url("${GRAIN_SVG}")`,
        backgroundSize: "180px 180px",
        animation: "grainShift 1s steps(6) infinite",
      }}
    />
  );
}

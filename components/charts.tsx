"use client";

import { useState } from "react";

// Inline-SVG charts following the dataviz mark specs:
// 2px lines, >=8px end markers with a 2px surface ring, bars <=24px with
// 4px rounded data-ends (square at baseline), hairline gridlines,
// text in text tokens (never the series color).

const SERIES = "#c2410c"; // validated: >=3:1 on white, chroma + lightness pass
const TRACK = "#a8a29e"; // de-emphasis hue for the sparkline history
const GRID = "#efede9";

export function Sparkline({
  points,
  width = 96,
  height = 28,
}: {
  points: number[];
  width?: number;
  height?: number;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 4;
  const step = (width - pad * 2) / (points.length - 1);
  const y = (v: number) =>
    height - pad - ((v - min) / span) * (height - pad * 2);
  const coords = points.map((v, i) => [pad + i * step, y(v)] as const);
  const path = coords.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px},${py}`).join(" ");
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={path}
        fill="none"
        stroke={TRACK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* current period rides in the accent */}
      <path
        d={`M${coords[coords.length - 2][0]},${coords[coords.length - 2][1]} L${lastX},${lastY}`}
        fill="none"
        stroke={SERIES}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={4} fill={SERIES} stroke="#ffffff" strokeWidth={2} />
    </svg>
  );
}

export function WeeklyBars({
  data,
  height = 160,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const peak = data.findIndex((d) => d.value === max);

  return (
    <div>
      <div
        className="relative grid items-end gap-3"
        style={{
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
          height,
          backgroundImage: `repeating-linear-gradient(to top, transparent, transparent calc(25% - 1px), ${GRID} calc(25% - 1px), ${GRID} 25%)`,
        }}
      >
        {data.map((d, i) => {
          const h = Math.max(6, (d.value / max) * (height - 24));
          return (
            <div
              key={d.label}
              className="relative flex h-full cursor-default items-end justify-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* selective direct label: the peak only; the rest live in the tooltip */}
              {(i === peak || hover === i) && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-xs font-medium tabular-nums text-muted-foreground"
                  style={{ bottom: h + 6 }}
                >
                  {d.value.toLocaleString()}
                </span>
              )}
              <div
                className="w-full max-w-6 transition-opacity"
                style={{
                  height: h,
                  background: SERIES,
                  borderRadius: "4px 4px 0 0",
                  opacity: hover === null || hover === i ? 1 : 0.45,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        className="mt-2 grid gap-3 text-center text-xs text-muted-foreground"
        style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
      >
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

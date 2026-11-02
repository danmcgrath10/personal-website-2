"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const WIDTH = 1200;
const HEIGHT = 220;
const CENTER = HEIGHT / 2;
const MAX_GAIN = 86;
const BAND_WIDTH = 150;
const FREQUENCY_LINES = [
  { x: 150, label: "50 Hz" },
  { x: 420, label: "200 Hz" },
  { x: 690, label: "1 kHz" },
  { x: 960, label: "5 kHz" },
];

type Band = { name: string; x: number; gain: number };

const START: Band[] = [
  { name: "Low", x: 210, gain: 38 },
  { name: "Mid", x: 590, gain: -44 },
  { name: "High", x: 960, gain: 62 },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function curveY(x: number, bands: Band[]) {
  const boost = bands.reduce(
    (sum, band) => sum + band.gain * Math.exp(-(((x - band.x) / BAND_WIDTH) ** 2)),
    0
  );
  return clamp(CENTER - boost, 4, HEIGHT - 4);
}

export default function EqCurve() {
  const svg = useRef<SVGSVGElement>(null);
  const [bands, setBands] = useState(START);
  const [dragging, setDragging] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const update = (index: number, change: Partial<Band>) => {
    setSettled(true);
    setBands((current) =>
      current.map((band, i) =>
        i === index
          ? {
              ...band,
              x: clamp(change.x ?? band.x, 30, WIDTH - 30),
              gain: clamp(change.gain ?? band.gain, -MAX_GAIN, MAX_GAIN),
            }
          : band
      )
    );
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !svg.current) return;
    const box = svg.current.getBoundingClientRect();
    update(dragging, {
      x: ((event.clientX - box.left) / box.width) * WIDTH,
      gain: CENTER - ((event.clientY - box.top) / box.height) * HEIGHT,
    });
  };

  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>, index: number) => {
    const moves: Record<string, Partial<Band>> = {
      ArrowUp: { gain: bands[index].gain + 6 },
      ArrowDown: { gain: bands[index].gain - 6 },
      ArrowLeft: { x: bands[index].x - 20 },
      ArrowRight: { x: bands[index].x + 20 },
    };
    if (moves[event.key]) {
      event.preventDefault();
      update(index, moves[event.key]);
    }
  };

  // Phones use a narrower drawing space, so the curve stays tall and the points stay easy to touch.
  const viewWidth = narrow ? WIDTH / 2 : WIDTH;
  const toView = (x: number) => (x * viewWidth) / WIDTH;

  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 8) {
    points.push(`${toView(x)} ${curveY(x, bands).toFixed(1)}`);
  }
  const line = `M ${points.join(" L ")}`;

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${viewWidth} ${HEIGHT}`}
      className="block h-auto w-full select-none"
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
      role="group"
      aria-label="An interactive EQ curve with low, mid, and high controls"
    >
      <line x1="0" x2={viewWidth} y1={CENTER} y2={CENTER} stroke="#ffffff" strokeOpacity="0.28" />
      {FREQUENCY_LINES.map(({ x, label }) => (
        <g key={label}>
          <line x1={toView(x)} x2={toView(x)} y1="0" y2={HEIGHT} stroke="#ffffff" strokeOpacity="0.12" />
          <text x={toView(x) + 8} y={HEIGHT - 8} fill="#ffffff" fillOpacity="0.62" fontSize={narrow ? 18 : 15}>
            {label}
          </text>
        </g>
      ))}
      <path d={`${line} L ${viewWidth} ${HEIGHT} L 0 ${HEIGHT} Z`} fill="#e2ae4a" fillOpacity="0.1" />
      <path
        d={line}
        fill="none"
        stroke="#e2ae4a"
        strokeWidth="3.5"
        strokeLinejoin="round"
        pathLength={settled ? undefined : 1}
        className={settled ? undefined : "eq-line"}
      />
      {bands.map((band, index) => (
        <g key={band.name}>
          <circle
            cx={toView(band.x)}
            cy={CENTER - band.gain}
            r={narrow ? 36 : 30}
            fill="transparent"
            className="cursor-grab touch-none"
            tabIndex={0}
            role="slider"
            aria-label={`${band.name} band gain`}
            aria-valuemin={0}
            aria-valuemax={MAX_GAIN * 2}
            aria-valuenow={Math.round(band.gain + MAX_GAIN)}
            onKeyDown={(event) => onKeyDown(event, index)}
            onPointerDown={(event) => {
              event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
              setDragging(index);
            }}
          />
          <circle
            cx={toView(band.x)}
            cy={CENTER - band.gain}
            r={(dragging === index ? 12 : 9) * (narrow ? 1.3 : 1)}
            fill="#0b3a30"
            stroke="#e2ae4a"
            strokeWidth="3.5"
            pointerEvents="none"
          />
        </g>
      ))}
    </svg>
  );
}

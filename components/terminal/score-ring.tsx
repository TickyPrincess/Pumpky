"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  invert?: boolean; // for risk score: high = bad
  className?: string;
}

const SIZE_MAP = {
  sm: { diameter: 44, strokeW: 3, textSize: "text-xs" },
  md: { diameter: 64, strokeW: 4, textSize: "text-sm" },
  lg: { diameter: 88, strokeW: 5, textSize: "text-base" },
};

function scoreToColor(score: number, invert: boolean): string {
  const s = invert ? 100 - score : score;
  if (s >= 80) return "#00ff41";
  if (s >= 60) return "#00d632";
  if (s >= 40) return "#ffaa00";
  if (s >= 20) return "#ff7700";
  return "#ff3333";
}

export function ScoreRing({
  score,
  size = "md",
  label,
  invert = false,
  className,
}: ScoreRingProps) {
  const { diameter, strokeW, textSize } = SIZE_MAP[size];
  const radius = (diameter - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = scoreToColor(score, invert);
  const cx = diameter / 2;
  const cy = diameter / 2;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            transition: "stroke-dashoffset 0.6s ease",
          }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${cx}px ${cy}px`,
            fill: color,
            fontSize: size === "sm" ? 11 : size === "md" ? 14 : 18,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
          }}
        >
          {score}
        </text>
      </svg>
      {label && (
        <span
          className={cn(
            "terminal-text font-medium tracking-widest uppercase",
            textSize === "text-xs" ? "text-[9px]" : "text-[10px]",
            "text-[#555]"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

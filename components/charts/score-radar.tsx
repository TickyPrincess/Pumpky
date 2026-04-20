"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TokenScores } from "@/lib/types";

interface ScoreRadarProps {
  scores: TokenScores;
  size?: number;
}

export function ScoreRadar({ scores, size = 220 }: ScoreRadarProps) {
  const data = [
    { subject: "OPP", value: scores.opportunity, fullMark: 100 },
    { subject: "MOM", value: scores.momentum, fullMark: 100 },
    { subject: "LIQ", value: scores.liquidity, fullMark: 100 },
    { subject: "SENT", value: scores.sentiment, fullMark: 100 },
    { subject: "SAFETY", value: 100 - scores.risk, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
        <PolarGrid
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="2 4"
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            fill: "#444",
          }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#00ff41"
          fill="#00ff41"
          fillOpacity={0.08}
          strokeWidth={1.5}
          dot={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="custom-tooltip">
                <div className="text-green-primary font-bold">
                  {payload[0].value}
                  <span className="text-[#555] ml-1">/ 100</span>
                </div>
              </div>
            );
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

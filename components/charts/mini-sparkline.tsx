"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniSparklineProps {
  data: number[];
  positive?: boolean;
  height?: number;
  width?: number;
}

export function MiniSparkline({
  data,
  positive = true,
  height = 28,
  width = 72,
}: MiniSparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? "#00ff41" : "#ff3333";

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

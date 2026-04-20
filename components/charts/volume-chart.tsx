"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import type { ChartDataPoint } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface VolumeChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export function VolumeChart({ data, height = 170 }: VolumeChartProps) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-[#333] terminal-text text-xs"
        style={{ height }}
      >
        NO VOLUME DATA
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="time"
          tickFormatter={(value: string) => {
            try {
              return format(new Date(value), "HH:mm");
            } catch {
              return value;
            }
          }}
          tick={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            fill: "#333",
          }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(value: number) => formatNumber(value, { decimals: 1 })}
          tick={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            fill: "#333",
          }}
          tickLine={false}
          axisLine={false}
          width={54}
          tickCount={4}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;

            let formattedLabel = label as string;
            try {
              formattedLabel = format(new Date(label as string), "MMM d, HH:mm");
            } catch {
              // noop
            }

            return (
              <div className="custom-tooltip">
                <div className="text-[#555] text-[10px] mb-0.5">{formattedLabel}</div>
                <div className="text-green-primary font-bold text-[12px]">
                  {formatNumber(Number(payload[0].value), { prefix: "$" })}
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="value" fill="rgba(0,255,65,0.35)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ChartDataPoint } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface PriceChartProps {
  data: ChartDataPoint[];
  isPositive?: boolean;
  height?: number;
}

export function PriceChart({
  data,
  isPositive = true,
  height = 200,
}: PriceChartProps) {
  const color = isPositive ? "#00ff41" : "#ff3333";
  const gradientId = `price-gradient-${isPositive ? "pos" : "neg"}`;

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[#333] terminal-text text-xs"
        style={{ height }}
      >
        NO DATA
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tickFormatter={(t: string) => {
            try {
              return format(new Date(t), "HH:mm");
            } catch {
              return t;
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
          tickFormatter={(v: number) => formatPrice(v).replace("$", "")}
          tick={{
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            fill: "#333",
          }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickCount={4}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, fill: color, stroke: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  let formattedTime = label ?? "";
  try {
    formattedTime = format(new Date(label ?? ""), "MMM d, HH:mm");
  } catch {}

  return (
    <div className="custom-tooltip">
      <div className="text-[#555] text-[10px] mb-0.5">{formattedTime}</div>
      <div className="text-green-primary font-bold text-[12px]">
        {formatPrice(payload[0].value)}
      </div>
    </div>
  );
}

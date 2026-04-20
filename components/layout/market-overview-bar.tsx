"use client";

import { cn, formatNumber, formatPct } from "@/lib/utils";
import type { MarketOverview } from "@/lib/types";

interface MarketOverviewBarProps {
  overview: MarketOverview;
}

export function MarketOverviewBar({ overview }: MarketOverviewBarProps) {
  const fearColor =
    overview.fearGreedIndex >= 70
      ? "text-green-primary"
      : overview.fearGreedIndex >= 50
      ? "text-yellow-400"
      : "text-danger";

  return (
    <div className="flex items-center gap-6 px-6 py-2.5 border-b border-white/[0.04] bg-[#070707] overflow-x-auto no-scrollbar">
      <MetricItem
        label="Total MCap"
        value={formatNumber(overview.totalMcap, { prefix: "$" })}
        change={overview.mcapChange24h}
      />
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <MetricItem
        label="24h Volume"
        value={formatNumber(overview.totalVolume24h, { prefix: "$" })}
        change={overview.volumeChange24h}
      />
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
          Fear & Greed
        </span>
        <span className={cn("terminal-text text-[11px] font-bold", fearColor)}>
          {overview.fearGreedIndex}
        </span>
        <span className={cn("terminal-text text-[10px]", fearColor)}>
          {overview.fearGreedLabel}
        </span>
      </div>
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
          Top Gainer
        </span>
        <span className="terminal-text text-[11px] text-white/60">
          {overview.topGainer.symbol}
        </span>
        <span className="terminal-text text-[11px] text-green-primary font-medium">
          {formatPct(overview.topGainer.priceChange24h)}
        </span>
      </div>
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
          Top Loser
        </span>
        <span className="terminal-text text-[11px] text-white/60">
          {overview.topLoser.symbol}
        </span>
        <span className="terminal-text text-[11px] text-danger font-medium">
          {formatPct(overview.topLoser.priceChange24h)}
        </span>
      </div>
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
          Sentiment
        </span>
        <span
          className={cn(
            "terminal-text text-[10px] font-semibold uppercase tracking-widest",
            overview.trendingSentiment === "bullish"
              ? "text-green-primary"
              : overview.trendingSentiment === "bearish"
              ? "text-danger"
              : "text-yellow-400"
          )}
        >
          {overview.trendingSentiment}
        </span>
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: number;
}) {
  const isUp = change >= 0;
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
        {label}
      </span>
      <span className="terminal-text text-[11px] text-white/70 font-medium">
        {value}
      </span>
      <span
        className={cn(
          "terminal-text text-[10px]",
          isUp ? "text-green-primary" : "text-danger"
        )}
      >
        {formatPct(change)}
      </span>
    </div>
  );
}

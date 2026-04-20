"use client";

import { motion } from "framer-motion";
import { Star, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import {
  cn,
  formatPrice,
  formatPct,
  formatNumber,
  chainToColor,
  verdictToLabel,
} from "@/lib/utils";
import type { Token } from "@/lib/types";
import { useWatchlistStore } from "@/store/watchlist";

interface TokenCardProps {
  token: Token;
  rank?: number;
  compact?: boolean;
}

export function TokenCard({ token, rank, compact }: TokenCardProps) {
  const { add, remove, has } = useWatchlistStore();
  const watched = has(token.id);
  const isUp = token.priceChange24h >= 0;
  const isDown = token.priceChange24h < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/tokens/${token.id}`}>
        <div
          className={cn(
            "panel panel-hover cursor-pointer group transition-all duration-200",
            compact ? "p-3" : "p-4"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {rank && (
                <span className="terminal-text text-[11px] text-[#333] w-5 flex-shrink-0">
                  #{rank}
                </span>
              )}
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold terminal-text flex-shrink-0"
                style={{
                  background: "rgba(0,255,65,0.06)",
                  border: "1px solid rgba(0,255,65,0.1)",
                  color: "var(--green-primary)",
                }}
              >
                {token.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white/90">
                    {token.symbol}
                  </span>
                  <span
                    className={cn(
                      "terminal-text text-[9px] font-medium",
                      chainToColor(token.chain)
                    )}
                  >
                    {token.chain}
                  </span>
                </div>
                <div className="text-[11px] text-[#444] truncate max-w-[120px]">
                  {token.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendIcon direction={token.trendDirection} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  watched ? remove(token.id) : add(token);
                }}
                className={cn(
                  "p-1 rounded transition-colors",
                  watched
                    ? "text-green-primary"
                    : "text-[#333] hover:text-[#666]"
                )}
              >
                <Star size={13} fill={watched ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="terminal-text font-semibold text-sm text-white/80">
              {formatPrice(token.price)}
            </span>
            <span
              className={cn(
                "terminal-text text-xs font-medium",
                isUp ? "text-green-primary" : "text-danger"
              )}
            >
              {formatPct(token.priceChange24h)}
            </span>
          </div>

          {/* Scores row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <ScoreMetric label="OPP" value={token.scores.opportunity} />
            <ScoreMetric label="MOM" value={token.scores.momentum} />
            <ScoreMetric label="RISK" value={token.scores.risk} invert />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="terminal-text text-[10px] text-[#444]">
                MCap{" "}
                <span className="text-[#666]">
                  {formatNumber(token.marketCap, { prefix: "$" })}
                </span>
              </span>
              <span className="terminal-text text-[10px] text-[#444]">
                Vol{" "}
                <span className="text-[#666]">
                  {formatNumber(token.volume24h, { prefix: "$" })}
                </span>
              </span>
            </div>
            <VerdictBadge verdict={token.aiSummary.verdict} />
          </div>

          {/* Red flags */}
          {token.redFlags.length > 0 && !compact && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/[0.03]">
              <AlertTriangle size={10} className="text-warning/60 flex-shrink-0" />
              <span className="terminal-text text-[10px] text-warning/50 truncate">
                {token.redFlags[0]}
                {token.redFlags.length > 1 && ` +${token.redFlags.length - 1}`}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function ScoreMetric({
  label,
  value,
  invert,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  const getColor = (v: number, inv: boolean) => {
    const s = inv ? 100 - v : v;
    if (s >= 75) return "var(--green-primary)";
    if (s >= 50) return "var(--green-glow)";
    if (s >= 30) return "#ffaa00";
    return "#ff3333";
  };

  const color = getColor(value, !!invert);

  return (
    <div className="text-center">
      <div
        className="terminal-text text-sm font-bold"
        style={{ color }}
      >
        {value}
      </div>
      <div className="terminal-text text-[9px] text-[#333] tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    "buy-signal": { bg: "rgba(0,255,65,0.1)", text: "#00ff41" },
    "watch": { bg: "rgba(0,170,255,0.1)", text: "#00aaff" },
    "degen-play": { bg: "rgba(255,170,0,0.1)", text: "#ffaa00" },
    "high-risk": { bg: "rgba(255,119,0,0.1)", text: "#ff7700" },
    "avoid": { bg: "rgba(255,51,51,0.1)", text: "#ff3333" },
  };

  const style = colorMap[verdict] ?? { bg: "rgba(255,255,255,0.05)", text: "#666" };

  return (
    <span
      className="terminal-text text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
      style={{ background: style.bg, color: style.text }}
    >
      {verdictToLabel(verdict)}
    </span>
  );
}

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "up")
    return <TrendingUp size={12} className="text-green-primary/60" />;
  if (direction === "down")
    return <TrendingDown size={12} className="text-danger/60" />;
  return <Minus size={12} className="text-[#444]" />;
}

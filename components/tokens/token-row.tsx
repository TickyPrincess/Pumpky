"use client";

import Link from "next/link";
import { Star, AlertTriangle } from "lucide-react";
import {
  cn,
  formatPrice,
  formatPct,
  formatNumber,
  chainToColor,
} from "@/lib/utils";
import type { Token } from "@/lib/types";
import { useWatchlistStore } from "@/store/watchlist";

interface TokenRowProps {
  token: Token;
  rank: number;
}

export function TokenRow({ token, rank }: TokenRowProps) {
  const { add, remove, has } = useWatchlistStore();
  const watched = has(token.id);
  const isUp24h = token.priceChange24h >= 0;
  const isUp1h = token.priceChange1h >= 0;

  return (
    <tr className="border-b border-white/[0.02] hover:bg-white/[0.012] transition-colors group">
      {/* Rank */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (watched ? remove(token.id) : add(token))}
            className={cn(
              "transition-colors",
              watched ? "text-green-primary" : "text-[#2a2a2a] group-hover:text-[#444]"
            )}
          >
            <Star size={11} fill={watched ? "currentColor" : "none"} />
          </button>
          <span className="terminal-text text-[11px] text-[#333]">
            {rank}
          </span>
        </div>
      </td>

      {/* Token */}
      <td className="px-4 py-3">
        <Link
          href={`/tokens/${token.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold terminal-text flex-shrink-0"
            style={{
              background: "rgba(0,255,65,0.05)",
              border: "1px solid rgba(0,255,65,0.08)",
              color: "var(--green-primary)",
            }}
          >
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <span className="font-semibold text-[13px] text-white/80 block">
              {token.symbol}
            </span>
            <span className="text-[10px] text-[#444]">{token.name}</span>
          </div>
          <span
            className={cn(
              "terminal-text text-[9px] ml-1",
              chainToColor(token.chain)
            )}
          >
            {token.chain}
          </span>
        </Link>
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-right">
        <span className="terminal-text text-[12px] text-white/70">
          {formatPrice(token.price)}
        </span>
      </td>

      {/* 1h */}
      <td className="px-4 py-3 text-right">
        <span
          className={cn(
            "terminal-text text-[11px]",
            isUp1h ? "text-green-primary" : "text-danger"
          )}
        >
          {formatPct(token.priceChange1h)}
        </span>
      </td>

      {/* 24h */}
      <td className="px-4 py-3 text-right">
        <span
          className={cn(
            "terminal-text text-[11px] font-medium",
            isUp24h ? "text-green-primary" : "text-danger"
          )}
        >
          {formatPct(token.priceChange24h)}
        </span>
      </td>

      {/* Volume */}
      <td className="px-4 py-3 text-right">
        <span className="terminal-text text-[11px] text-[#666]">
          {formatNumber(token.volume24h, { prefix: "$" })}
        </span>
      </td>

      {/* MCap */}
      <td className="px-4 py-3 text-right">
        <span className="terminal-text text-[11px] text-[#555]">
          {formatNumber(token.marketCap, { prefix: "$" })}
        </span>
      </td>

      {/* Opportunity */}
      <td className="px-4 py-3 text-center">
        <ScoreCell value={token.scores.opportunity} />
      </td>

      {/* Risk */}
      <td className="px-4 py-3 text-center">
        <ScoreCell value={token.scores.risk} invert />
      </td>

      {/* Momentum */}
      <td className="px-4 py-3 text-center">
        <ScoreCell value={token.scores.momentum} />
      </td>

      {/* Verdict */}
      <td className="px-4 py-3">
        <VerdictCell verdict={token.aiSummary.verdict} />
      </td>

      {/* Flags */}
      <td className="px-4 py-3">
        {token.redFlags.length > 0 ? (
          <div className="flex items-center gap-1">
            <AlertTriangle size={10} className="text-warning/50" />
            <span className="terminal-text text-[10px] text-warning/40">
              {token.redFlags.length}
            </span>
          </div>
        ) : (
          <span className="terminal-text text-[10px] text-green-dim">
            clean
          </span>
        )}
      </td>
    </tr>
  );
}

function ScoreCell({
  value,
  invert,
}: {
  value: number;
  invert?: boolean;
}) {
  const s = invert ? 100 - value : value;
  let color = "#ff3333";
  if (s >= 75) color = "#00ff41";
  else if (s >= 55) color = "#00d632";
  else if (s >= 35) color = "#ffaa00";
  else if (s >= 15) color = "#ff7700";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className="terminal-text text-xs font-bold"
        style={{ color }}
      >
        {value}
      </span>
      <div className="w-8 score-bar">
        <div
          className="score-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function VerdictCell({ verdict }: { verdict: string }) {
  const styles: Record<string, string> = {
    "buy-signal": "text-green-primary bg-green-primary/10",
    "watch": "text-info bg-info/10",
    "degen-play": "text-warning bg-warning/10",
    "high-risk": "text-orange-400 bg-orange-400/10",
    "avoid": "text-danger bg-danger/10",
  };

  const labels: Record<string, string> = {
    "buy-signal": "BUY",
    "watch": "WATCH",
    "degen-play": "DEGEN",
    "high-risk": "RISK",
    "avoid": "AVOID",
  };

  return (
    <span
      className={cn(
        "terminal-text text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded",
        styles[verdict] ?? "text-[#555] bg-white/[0.04]"
      )}
    >
      {labels[verdict] ?? verdict.toUpperCase()}
    </span>
  );
}

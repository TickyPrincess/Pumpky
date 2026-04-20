"use client";

import { motion } from "framer-motion";
import { formatPrice, formatPct, cn } from "@/lib/utils";
import type { Token } from "@/lib/types";

interface TickerBarProps {
  tokens: Token[];
}

export function TickerBar({ tokens }: TickerBarProps) {
  const items = [...tokens, ...tokens]; // double for infinite loop

  return (
    <div className="w-full border-b border-white/[0.04] bg-[#060606] overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-r border-white/[0.04] bg-[#0a0a0a]">
          <span className="status-dot" />
          <span className="terminal-text text-[10px] tracking-widest text-green-primary/60 uppercase">
            Meme Ticker
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex gap-8 items-center py-2 px-4 w-max"
            animate={{ x: [0, -50 * tokens.length] }}
            transition={{
              duration: tokens.length * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {items.map((token, i) => (
              <TickerItem key={`${token.id}-${i}`} token={token} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TickerItem({ token }: { token: Token }) {
  const isUp = token.priceChange24h >= 0;

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="terminal-text text-xs font-semibold text-[#ccc]">
        {token.symbol}
      </span>
      <span className="terminal-text text-[11px] text-[#555]">
        {formatPrice(token.price)}
      </span>
      <span
        className={cn(
          "terminal-text text-[10px] font-medium",
          isUp ? "text-green-primary" : "text-danger"
        )}
      >
        {formatPct(token.priceChange24h)}
      </span>
      <span className="text-[#2a2a2a]">·</span>
    </div>
  );
}

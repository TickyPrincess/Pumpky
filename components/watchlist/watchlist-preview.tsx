"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWatchlistStore } from "@/store/watchlist";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { formatPct, cn } from "@/lib/utils";

export function WatchlistPreview() {
  const itemsMap = useWatchlistStore((state) => state.items);
  const items = useMemo(() => Object.values(itemsMap).slice(0, 4), [itemsMap]);

  return (
    <TerminalPanel
      title="Watchlist"
      subtitle="local"
      status="demo"
      actions={
        <Link href="/watchlist" className="terminal-text text-[10px] text-green-primary hover:underline">
          Open
        </Link>
      }
    >
      {items.length === 0 ? (
        <p className="terminal-text text-[11px] text-[#555]">No saved tokens yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.token.id} className="flex items-center justify-between border-b border-white/[0.03] pb-1.5 last:border-0">
              <span className="terminal-text text-xs text-white/75">{item.token.symbol}</span>
              <span
                className={cn(
                  "terminal-text text-[10px]",
                  item.token.priceChange24h >= 0 ? "text-green-primary" : "text-danger"
                )}
              >
                {formatPct(item.token.priceChange24h)}
              </span>
            </div>
          ))}
        </div>
      )}
    </TerminalPanel>
  );
}

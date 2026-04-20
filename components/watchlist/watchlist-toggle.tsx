"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWatchlistStore } from "@/store/watchlist";
import type { Token } from "@/lib/types";

interface WatchlistToggleProps {
  token: Token;
  className?: string;
  showLabel?: boolean;
}

export function WatchlistToggle({ token, className, showLabel = false }: WatchlistToggleProps) {
  const { add, remove, has } = useWatchlistStore();
  const watched = has(token.id);

  const handleClick = () => {
    if (watched) {
      remove(token.id);
      return;
    }

    add(token);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded border px-2.5 py-1.5 transition-colors",
        watched
          ? "border-green-primary/30 bg-green-primary/10 text-green-primary"
          : "border-white/[0.08] text-[#666] hover:text-[#9e9e9e]",
        className
      )}
    >
      <Star size={13} fill={watched ? "currentColor" : "none"} />
      {showLabel && (
        <span className="terminal-text text-[10px] uppercase tracking-wider">
          {watched ? "Watching" : "Watchlist"}
        </span>
      )}
    </button>
  );
}

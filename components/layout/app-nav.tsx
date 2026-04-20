"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Gauge,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { searchTokens } from "@/lib/data/provider";
import type { Token } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge, shortcut: "D" },
  { href: "/leaderboard", label: "Rankings", icon: BarChart3, shortcut: "R" },
  { href: "/watchlist", label: "Watchlist", icon: Star, shortcut: "W" },
  { href: "/pulse", label: "Pulse", icon: Activity, shortcut: "P" },
  { href: "/status", label: "API Status", icon: ShieldCheck, shortcut: "S" },
  { href: "/settings", label: "Settings", icon: Settings, shortcut: "," },
] as const;

const MOBILE_ITEMS = NAV_ITEMS.slice(0, 4);

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Token[]>([]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !searchOpen &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape" && searchOpen) {
        event.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = await searchTokens(query);
    setSearchResults(results);
  };

  return (
    <>
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-[220px] border-r border-white/[0.04] bg-[#070707] z-40 flex-col">
        <div className="px-5 py-5 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{
                background: "rgba(0,255,65,0.1)",
                border: "1px solid rgba(0,255,65,0.2)",
              }}
            >
              <Zap size={14} className="text-green-primary" />
            </div>
            <div>
              <span className="terminal-text font-bold text-sm glow-text-sm tracking-wider">
                PUMPKY
              </span>
              <span className="block terminal-text text-[9px] text-[#333] tracking-widest uppercase">
                operator terminal
              </span>
            </div>
          </Link>
        </div>

        <div className="px-3 py-3 border-b border-white/[0.04]">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-[#333] hover:text-[#777] hover:bg-white/[0.02] transition-colors border border-white/[0.04]"
          >
            <Search size={11} />
            <span className="terminal-text text-[11px] flex-1 text-left">Search token...</span>
            <kbd className="terminal-text text-[9px] text-[#222] border border-white/[0.06] rounded px-1">/</kbd>
          </button>
        </div>

        <div className="flex-1 py-3 px-2 overflow-y-auto no-scrollbar">
          <div className="mb-2 px-3">
            <span className="terminal-text text-[9px] text-[#2a2a2a] tracking-widest uppercase">
              Navigation
            </span>
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-[13px] transition-all duration-150 mb-0.5 group",
                  isActive
                    ? "text-green-primary bg-green-primary/[0.06] border border-green-primary/[0.08]"
                    : "text-[#444] hover:text-[#888] hover:bg-white/[0.02]"
                )}
              >
                <item.icon size={13} />
                <span className="font-medium flex-1">{item.label}</span>
                <span className="terminal-text text-[9px] text-[#2d2d2d]">{item.shortcut}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="w-1 h-1 rounded-full bg-green-primary"
                    style={{ boxShadow: "0 0 4px #00ff41" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="px-4 py-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="status-dot" />
            <span className="terminal-text text-[10px] text-green-muted/60">Demo feeds active</span>
          </div>
          <div className="terminal-text text-[9px] text-[#222] leading-relaxed">
            Analytics only. No guarantees.
            <br />
            Not financial advice.
          </div>
        </div>
      </nav>

      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#070707]/95 backdrop-blur border-b border-white/[0.05] z-40 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap size={13} className="text-green-primary" />
          <span className="terminal-text text-xs font-bold text-green-primary">PUMPKY</span>
        </Link>
        <button
          onClick={() => setSearchOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.08] text-[#666]"
        >
          <Search size={12} />
          <span className="terminal-text text-[10px]">Search</span>
        </button>
      </header>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 border-t border-white/[0.06] bg-[#070707]/95 backdrop-blur z-40 px-2 grid grid-cols-4">
        {MOBILE_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                isActive ? "text-green-primary" : "text-[#505050]"
              )}
            >
              <item.icon size={14} />
              <span className="terminal-text text-[9px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg mx-4 bg-[#0e0e0e] border border-green-primary/20 rounded-lg shadow-glow-md overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search size={14} className="text-green-primary/60" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search by symbol, name, or address"
                className="flex-1 bg-transparent terminal-text text-sm text-white/80 placeholder:text-[#333] outline-none"
              />
              <button
                onClick={closeSearch}
                className="terminal-text text-[10px] text-[#444] border border-white/[0.06] rounded px-1.5 py-0.5 hover:text-[#666]"
              >
                ESC
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="py-2 max-h-80 overflow-y-auto no-scrollbar">
                {searchResults.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => {
                      router.push(`/tokens/${token.id}`);
                      closeSearch();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold terminal-text flex-shrink-0"
                      style={{
                        background: "rgba(0,255,65,0.05)",
                        border: "1px solid rgba(0,255,65,0.08)",
                        color: "var(--green-primary)",
                      }}
                    >
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <span className="terminal-text text-xs font-semibold text-white/80">{token.symbol}</span>
                      <span className="terminal-text text-[10px] text-[#444] ml-2">{token.name}</span>
                    </div>
                    <span className="ml-auto terminal-text text-[10px] text-[#333]">{token.chain}</span>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="px-4 py-6 text-center terminal-text text-sm text-[#333]">
                No tokens found for &quot;{searchQuery}&quot;
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="px-4 py-4 terminal-text text-[11px] text-[#2a2a2a]">
                Type at least 2 characters to search
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

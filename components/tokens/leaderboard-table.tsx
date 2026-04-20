"use client";

import { useMemo, useState } from "react";
import type { Chain, Token, TokenSortKey } from "@/lib/types";
import { TokenRow } from "@/components/tokens/token-row";
import { TerminalPanel } from "@/components/terminal/terminal-panel";

interface LeaderboardTableProps {
  tokens: Token[];
}

const SORT_OPTIONS: Array<{ label: string; value: TokenSortKey }> = [
  { label: "Opportunity", value: "opportunity" },
  { label: "Momentum", value: "momentum" },
  { label: "Risk", value: "risk" },
  { label: "24h Change", value: "priceChange24h" },
  { label: "24h Volume", value: "volume24h" },
  { label: "Market Cap", value: "marketCap" },
  { label: "Liquidity", value: "liquidity" },
  { label: "Holders", value: "holders" },
  { label: "Age", value: "age" },
];

export function LeaderboardTable({ tokens }: LeaderboardTableProps) {
  const [search, setSearch] = useState("");
  const [chain, setChain] = useState<Chain | "all">("all");
  const [sortBy, setSortBy] = useState<TokenSortKey>("opportunity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [maxRisk, setMaxRisk] = useState(100);
  const [minOpportunity, setMinOpportunity] = useState(0);

  const rows = useMemo(() => {
    let next = [...tokens];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      next = next.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    if (chain !== "all") {
      next = next.filter((token) => token.chain === chain);
    }

    next = next.filter(
      (token) =>
        token.scores.risk <= maxRisk && token.scores.opportunity >= minOpportunity
    );

    next.sort((a, b) => {
      const getValue = (token: Token) => {
        switch (sortBy) {
          case "opportunity":
            return token.scores.opportunity;
          case "risk":
            return token.scores.risk;
          case "momentum":
            return token.scores.momentum;
          default:
            return token[sortBy];
        }
      };

      const first = getValue(a);
      const second = getValue(b);

      if (typeof first !== "number" || typeof second !== "number") return 0;
      return sortDir === "desc" ? second - first : first - second;
    });

    return next;
  }, [tokens, search, chain, sortBy, sortDir, maxRisk, minOpportunity]);

  return (
    <div className="space-y-5">
      <TerminalPanel title="Filters" subtitle="refine board" status="demo">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <Control label="Search">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="symbol or name"
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70 outline-none focus:border-green-primary/30"
            />
          </Control>

          <Control label="Chain">
            <select
              value={chain}
              onChange={(event) => setChain(event.target.value as Chain | "all")}
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70 outline-none"
            >
              <option value="all">All chains</option>
              <option value="SOL">SOL</option>
              <option value="ETH">ETH</option>
              <option value="BSC">BSC</option>
              <option value="BASE">BASE</option>
              <option value="AVAX">AVAX</option>
            </select>
          </Control>

          <Control label="Sort">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as TokenSortKey)}
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70 outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Control>

          <Control label="Direction">
            <select
              value={sortDir}
              onChange={(event) => setSortDir(event.target.value as "asc" | "desc")}
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70 outline-none"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </Control>

          <Control label={`Max risk (${maxRisk})`}>
            <input
              type="range"
              min={0}
              max={100}
              value={maxRisk}
              onChange={(event) => setMaxRisk(Number(event.target.value))}
              className="w-full"
            />
          </Control>

          <Control label={`Min opp (${minOpportunity})`}>
            <input
              type="range"
              min={0}
              max={100}
              value={minOpportunity}
              onChange={(event) => setMinOpportunity(Number(event.target.value))}
              className="w-full"
            />
          </Control>
        </div>
      </TerminalPanel>

      <TerminalPanel title="Leaderboard" subtitle={`${rows.length} tokens`} status="demo" noPadding>
        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table min-w-[1100px]">
            <thead>
              <tr>
                <th>#</th>
                <th>Token</th>
                <th className="text-right">Price</th>
                <th className="text-right">1h</th>
                <th className="text-right">24h</th>
                <th className="text-right">Volume</th>
                <th className="text-right">MCap</th>
                <th className="text-center">Opp</th>
                <th className="text-center">Risk</th>
                <th className="text-center">Mom</th>
                <th>Verdict</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((token, index) => (
                <TokenRow key={token.id} token={token} rank={index + 1} />
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="py-8 text-center terminal-text text-xs text-[#555]">
              No tokens match the current filters.
            </div>
          )}
        </div>
      </TerminalPanel>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

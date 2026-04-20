import { TerminalPanel } from "@/components/terminal/terminal-panel";
import {
  fetchMarketOverview,
  fetchTokens,
  fetchTrendingTokens,
} from "@/lib/data/provider";
import { formatNumber, formatPct, cn } from "@/lib/utils";

export const metadata = { title: "Market Pulse" };

export default async function PulsePage() {
  const [overview, trending, universe] = await Promise.all([
    fetchMarketOverview(),
    fetchTrendingTokens(6),
    fetchTokens({ sortBy: "volume24h", sortDir: "desc" }),
  ]);

  const volumeLeaders = universe.items.slice(0, 5);
  const riskHeat = [...universe.items].sort((a, b) => b.scores.risk - a.scores.risk).slice(0, 5);

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 gap-5">
      <div>
        <h1 className="text-xl font-semibold text-white/85 tracking-tight">Market Pulse</h1>
        <p className="terminal-text text-[11px] text-[#444] mt-1">
          Fast read on narrative heat, volume leaders, and risk pockets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PulseMetric label="Trend sentiment" value={overview.trendingSentiment.toUpperCase()} />
        <PulseMetric label="Fear & Greed" value={`${overview.fearGreedIndex} / 100`} />
        <PulseMetric label="Most active" value={overview.mostActive.symbol} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-5">
          <TerminalPanel title="Narrative heat" subtitle="where attention is" status="demo">
            <div className="space-y-2.5">
              {overview.narratives.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between terminal-text text-[10px]">
                    <span className="text-white/70">{item.name}</span>
                    <span className={cn(item.avgPerformance24h >= 0 ? "text-green-primary" : "text-danger")}>
                      {formatPct(item.avgPerformance24h)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${item.momentum}%`,
                        background: "linear-gradient(90deg, rgba(0,255,65,0.4), rgba(0,255,65,0.9))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>

        <div className="xl:col-span-4">
          <TerminalPanel title="Volume leaders" subtitle="24h turnover" status="demo">
            <div className="space-y-2">
              {volumeLeaders.map((token) => (
                <div key={token.id} className="rounded border border-white/[0.05] bg-[#0b0b0b] px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="terminal-text text-xs text-white/80">{token.symbol}</span>
                    <span className="terminal-text text-[10px] text-green-primary">
                      {formatPct(token.volumeChange24h)}
                    </span>
                  </div>
                  <div className="terminal-text text-[10px] text-[#666] mt-0.5">
                    Vol {formatNumber(token.volume24h, { prefix: "$" })}
                  </div>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>

        <div className="xl:col-span-3">
          <TerminalPanel title="Risk pressure" subtitle="high-risk names" status="demo">
            <div className="space-y-2">
              {riskHeat.map((token) => (
                <div key={token.id} className="flex items-center justify-between border-b border-white/[0.03] pb-1.5 last:border-0">
                  <span className="terminal-text text-xs text-white/75">{token.symbol}</span>
                  <span
                    className={cn(
                      "terminal-text text-[11px]",
                      token.scores.risk >= 80 ? "text-danger" : "text-warning"
                    )}
                  >
                    {token.scores.risk}
                  </span>
                </div>
              ))}
            </div>
          </TerminalPanel>
        </div>
      </div>

      <TerminalPanel title="Signal feed" subtitle="AI summaries" status="demo">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {trending.map((token) => (
            <div key={token.id} className="rounded border border-white/[0.05] bg-[#0b0b0b] p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="terminal-text text-xs text-white/80">{token.symbol}</span>
                <span
                  className={cn(
                    "terminal-text text-[10px]",
                    token.scores.opportunity >= 75
                      ? "text-green-primary"
                      : token.scores.risk >= 70
                      ? "text-warning"
                      : "text-[#777]"
                  )}
                >
                  {token.scores.opportunity}/100
                </span>
              </div>
              <p className="text-[12px] text-[#777] leading-relaxed">{token.aiSummary.headline}</p>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}

function PulseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/[0.07] bg-[#0b0b0b] px-3 py-2.5">
      <div className="terminal-text text-[9px] tracking-widest uppercase text-[#444]">{label}</div>
      <div className="terminal-text text-sm text-white/80 mt-1">{value}</div>
    </div>
  );
}

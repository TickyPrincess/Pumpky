import {
  fetchMarketOverview,
  fetchTrendingTokens,
  fetchTopOpportunities,
  fetchTokens,
} from "@/lib/data/provider";
import { MarketOverviewBar } from "@/components/layout/market-overview-bar";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { TickerBar } from "@/components/terminal/ticker-bar";
import { TokenCard } from "@/components/tokens/token-card";
import { WatchlistPreview } from "@/components/watchlist/watchlist-preview";
import { DEMO_TOKENS } from "@/lib/data/demo-tokens";
import { formatPct, cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [overview, trending, opportunities, allTokens] = await Promise.all([
    fetchMarketOverview(),
    fetchTrendingTokens(6),
    fetchTopOpportunities(5),
    fetchTokens({ sortBy: "momentum", sortDir: "desc" }),
  ]);

  return (
    <div className="flex flex-col flex-1">
      {/* Ticker */}
      <TickerBar tokens={DEMO_TOKENS} />

      {/* Market overview */}
      <MarketOverviewBar overview={overview} />

      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white/80 tracking-tight">
              Market Dashboard
            </h1>
            <p className="terminal-text text-[11px] text-[#444] mt-0.5">
              AI-ranked opportunities · Updated live · Demo mode
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" />
            <span className="terminal-text text-[10px] text-green-muted/60">
              {DEMO_TOKENS.length} tokens tracked
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Avg Opportunity"
            value={Math.round(
              DEMO_TOKENS.reduce((a, t) => a + t.scores.opportunity, 0) /
                DEMO_TOKENS.length
            ).toString()}
            suffix="/100"
            color="green"
            sub="Composite signal"
          />
          <StatCard
            label="High Conviction"
            value={
              DEMO_TOKENS.filter((t) => t.scores.opportunity >= 75).length.toString()
            }
            suffix=" tokens"
            color="green"
            sub="Score ≥ 75"
          />
          <StatCard
            label="High Risk"
            value={
              DEMO_TOKENS.filter((t) => t.scores.risk >= 70).length.toString()
            }
            suffix=" tokens"
            color="warning"
            sub="Risk ≥ 70"
          />
          <StatCard
            label="Active Alerts"
            value="0"
            suffix=" set"
            color="muted"
            sub="Set from watchlist"
          />
        </div>

        <TerminalPanel title="Quick Filters" subtitle="execution presets" status="demo">
          <div className="flex flex-wrap gap-2">
            {["SOL only", "Opp > 75", "Risk < 55", "Volume spike", "New launches", "AI narrative"].map(
              (preset) => (
                <button
                  key={preset}
                  className="terminal-text text-[10px] uppercase tracking-wider rounded border border-white/[0.08] px-2.5 py-1 text-[#666] hover:text-green-primary hover:border-green-primary/25 transition-colors"
                >
                  {preset}
                </button>
              )
            )}
          </div>
        </TerminalPanel>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Trending — left 8 cols */}
          <div className="lg:col-span-8 space-y-5">
            {/* Trending tokens */}
            <TerminalPanel
              title="Trending"
              subtitle="top momentum"
              status="demo"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {trending.map((token, i) => (
                  <TokenCard key={token.id} token={token} rank={i + 1} />
                ))}
              </div>
            </TerminalPanel>

            {/* Narrative breakdown */}
            <TerminalPanel title="Narrative Heat" status="demo">
              <div className="space-y-3">
                {overview.narratives.map((n) => (
                  <NarrativeRow key={n.name} narrative={n} />
                ))}
              </div>
            </TerminalPanel>
          </div>

          {/* Right column — 4 cols */}
          <div className="lg:col-span-4 space-y-5">
            {/* Top opportunities */}
            <TerminalPanel
              title="Top Opportunities"
              subtitle="AI ranked"
              status="demo"
            >
              <div className="space-y-2">
                {opportunities.map((token, i) => (
                  <OpportunityRow key={token.id} token={token} rank={i + 1} />
                ))}
              </div>
            </TerminalPanel>

            {/* Risk board */}
            <TerminalPanel title="Risk Board" subtitle="watch list" status="demo">
              <div className="space-y-2">
                {DEMO_TOKENS.filter((t) => t.scores.risk >= 60)
                  .sort((a, b) => b.scores.risk - a.scores.risk)
                  .slice(0, 5)
                  .map((token) => (
                    <RiskRow key={token.id} token={token} />
                  ))}
              </div>
            </TerminalPanel>

            {/* AI Insights */}
            <TerminalPanel title="AI Insights" subtitle="latest signals" status="demo">
              <div className="space-y-3">
                {allTokens.items
                  .filter((t) => t.aiSummary.verdict === "buy-signal")
                  .slice(0, 3)
                  .map((token) => (
                    <InsightCard key={token.id} token={token} />
                  ))}
              </div>
            </TerminalPanel>

            <WatchlistPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  color,
  sub,
}: {
  label: string;
  value: string;
  suffix: string;
  color: "green" | "warning" | "danger" | "muted";
  sub: string;
}) {
  const colorMap = {
    green: "text-green-primary",
    warning: "text-yellow-400",
    danger: "text-danger",
    muted: "text-[#555]",
  };

  return (
    <div className="panel p-4 space-y-1">
      <div className="terminal-text text-[10px] text-[#444] tracking-widest uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "terminal-text text-2xl font-bold",
            colorMap[color]
          )}
        >
          {value}
        </span>
        <span className="terminal-text text-xs text-[#444]">{suffix}</span>
      </div>
      <div className="terminal-text text-[10px] text-[#2a2a2a]">{sub}</div>
    </div>
  );
}

function NarrativeRow({
  narrative,
}: {
  narrative: {
    name: string;
    momentum: number;
    tokenCount: number;
    avgPerformance24h: number;
  };
}) {
  const isUp = narrative.avgPerformance24h >= 0;
  const barColor =
    narrative.momentum >= 80
      ? "#00ff41"
      : narrative.momentum >= 60
      ? "#00d632"
      : narrative.momentum >= 40
      ? "#ffaa00"
      : "#ff3333";

  return (
    <div className="flex items-center gap-4">
      <div className="w-28 terminal-text text-xs text-white/60">
        {narrative.name}
      </div>
      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${narrative.momentum}%`,
            background: barColor,
            boxShadow: `0 0 6px ${barColor}40`,
          }}
        />
      </div>
      <div className="terminal-text text-[11px] w-8 text-[#444]">
        {narrative.momentum}
      </div>
      <div
        className={cn(
          "terminal-text text-[10px] w-16 text-right font-medium",
          isUp ? "text-green-primary" : "text-danger"
        )}
      >
        {formatPct(narrative.avgPerformance24h)}
      </div>
      <div className="terminal-text text-[10px] text-[#333] w-12 text-right">
        {narrative.tokenCount} tkns
      </div>
    </div>
  );
}

function OpportunityRow({
  token,
  rank,
}: {
  token: { id: string; symbol: string; scores: { opportunity: number; risk: number }; priceChange24h: number; aiSummary: { verdict: string } };
  rank: number;
}) {
  const isUp = token.priceChange24h >= 0;
  const verdictColor: Record<string, string> = {
    "buy-signal": "text-green-primary",
    "watch": "text-info",
    "degen-play": "text-yellow-400",
    "high-risk": "text-orange-400",
    "avoid": "text-danger",
  };

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-white/[0.02] last:border-0">
      <span className="terminal-text text-[10px] text-[#2a2a2a] w-4">
        {rank}
      </span>
      <span className="terminal-text text-xs font-semibold text-white/70 flex-1">
        {token.symbol}
      </span>
      <span
        className={cn(
          "terminal-text text-[11px]",
          isUp ? "text-green-primary" : "text-danger"
        )}
      >
        {formatPct(token.priceChange24h)}
      </span>
      <span
        className="terminal-text text-xs font-bold text-green-primary"
        style={{
          textShadow: "0 0 6px rgba(0,255,65,0.5)",
        }}
      >
        {token.scores.opportunity}
      </span>
    </div>
  );
}

function RiskRow({
  token,
}: {
  token: { id: string; symbol: string; scores: { risk: number }; redFlags: string[] };
}) {
  const riskColor =
    token.scores.risk >= 80
      ? "#ff3333"
      : token.scores.risk >= 65
      ? "#ff7700"
      : "#ffaa00";

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-white/[0.02] last:border-0">
      <span className="terminal-text text-xs text-white/50 flex-1">
        {token.symbol}
      </span>
      <div className="flex items-center gap-1.5">
        <span
          className="terminal-text text-xs font-bold"
          style={{ color: riskColor, textShadow: `0 0 6px ${riskColor}50` }}
        >
          {token.scores.risk}
        </span>
        <span
          className="terminal-text text-[9px] uppercase tracking-widest"
          style={{ color: riskColor }}
        >
          risk
        </span>
      </div>
    </div>
  );
}

function InsightCard({
  token,
}: {
  token: { symbol: string; aiSummary: { headline: string; verdict: string } };
}) {
  return (
    <div className="border border-green-primary/[0.06] rounded p-2.5 bg-green-ghost hover:border-green-primary/[0.12] transition-colors">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="status-dot" />
        <span className="terminal-text text-[10px] font-semibold text-white/70">
          {token.symbol}
        </span>
        <span className="terminal-text text-[9px] text-green-muted/60 ml-auto">
          BUY SIGNAL
        </span>
      </div>
      <p className="terminal-text text-[10px] text-[#555] leading-relaxed line-clamp-2">
        {token.aiSummary.headline}
      </p>
    </div>
  );
}

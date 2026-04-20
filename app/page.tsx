import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { fetchMarketOverview, fetchTopOpportunities } from "@/lib/data/provider";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { formatNumber, formatPct } from "@/lib/utils";

export default async function LandingPage() {
  const [overview, opportunities] = await Promise.all([
    fetchMarketOverview(),
    fetchTopOpportunities(5),
  ]);

  return (
    <main className="min-h-screen bg-[#030303] text-white relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,65,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-60" />

      <header className="relative z-10 px-6 md:px-10 py-5 border-b border-white/[0.05] bg-[#060606]/70 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-green-primary" />
            <span className="terminal-text text-sm font-bold tracking-wider glow-text-sm">PUMPKY</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="terminal-text text-xs text-[#666] hover:text-[#aaa] transition-colors"
            >
              Rankings
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded border border-green-primary/30 bg-green-primary/10 px-3 py-1.5 terminal-text text-xs text-green-primary hover:bg-green-primary/15"
            >
              Enter terminal
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="terminal-text text-[11px] tracking-[0.2em] text-green-primary/70 uppercase">
              AI meme coin flipping assistant
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight max-w-4xl">
              Spot meme coin setups before
              <span className="glow-text"> they hit your timeline</span>
            </h1>
            <p className="text-base md:text-lg text-[#8a8a8a] max-w-2xl leading-relaxed">
              Pumpky ranks short-term opportunities with momentum, liquidity, social traction,
              and on-chain risk signals. Built for fast operators, not hopium.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded border border-green-primary/35 bg-green-primary/10 px-4 py-2 terminal-text text-xs font-semibold tracking-wide text-green-primary hover:bg-green-primary/15"
              >
                Open Dashboard
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/watchlist"
                className="inline-flex items-center gap-2 rounded border border-white/[0.08] px-4 py-2 terminal-text text-xs tracking-wide text-[#b0b0b0] hover:text-white"
              >
                Build Watchlist
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              <Metric label="Market Cap" value={formatNumber(overview.totalMcap, { prefix: "$" })} delta={overview.mcapChange24h} />
              <Metric label="24h Volume" value={formatNumber(overview.totalVolume24h, { prefix: "$" })} delta={overview.volumeChange24h} />
              <Metric label="Fear/Greed" value={`${overview.fearGreedIndex}`} delta={overview.fearGreedIndex - 50} />
              <Metric label="Tracked Tokens" value={`${opportunities.length}+`} delta={12.4} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <TerminalPanel title="Live opportunity feed" subtitle="demo mode" status="demo" glow>
              <div className="space-y-2">
                {opportunities.map((token, index) => (
                  <Link
                    key={token.id}
                    href={`/tokens/${token.id}`}
                    className="flex items-center gap-3 rounded border border-white/[0.04] p-2.5 hover:border-green-primary/20 transition-colors"
                  >
                    <span className="terminal-text text-[10px] text-[#333] w-4">{index + 1}</span>
                    <span className="terminal-text text-xs font-semibold text-white/80 min-w-16">{token.symbol}</span>
                    <span className="terminal-text text-[11px] text-[#666] flex-1 truncate">{token.aiSummary.headline}</span>
                    <span className="terminal-text text-xs font-bold text-green-primary">{token.scores.opportunity}</span>
                  </Link>
                ))}
              </div>
            </TerminalPanel>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Feature
            title="Weighted scoring engine"
            body="Opportunity, risk, momentum, sentiment, and liquidity are scored 0-100 with transparent weighted factors."
            icon={<Sparkles size={14} />}
          />
          <Feature
            title="Red-flag first analysis"
            body="Contract checks, holder concentration, sniper pressure, and liquidity lock status surface risk before entry."
            icon={<ShieldAlert size={14} />}
          />
          <Feature
            title="Operator-grade workflow"
            body="Leaderboard, token deep dive, watchlist notes, and simulated alerts are tuned for short-term decision speed."
            icon={<Zap size={14} />}
          />
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-14">
        <TerminalPanel title="Scoring model" subtitle="opportunity formula" status="demo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreLine name="Momentum" weight="30%" desc="Price acceleration + volume surge + buy/sell pressure." />
            <ScoreLine name="Liquidity" weight="20%" desc="Depth, lock quality, and liquidity-to-mcap ratio." />
            <ScoreLine name="Social traction" weight="20%" desc="Narrative heat, mentions, community activity." />
            <ScoreLine name="Volume acceleration" weight="15%" desc="Short-term demand expansion across the board." />
            <ScoreLine name="Narrative heat" weight="15%" desc="How hard the current meme narrative is running." />
            <div className="rounded border border-warning/20 bg-warning/5 p-3">
              <p className="terminal-text text-[10px] tracking-widest uppercase text-warning/70 mb-1">Important</p>
              <p className="text-[12px] text-[#888]">
                Pumpky provides analytics, not guarantees. Meme coins are high volatility and can go to zero.
              </p>
            </div>
          </div>
        </TerminalPanel>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: number;
}) {
  const positive = delta >= 0;

  return (
    <div className="rounded border border-white/[0.06] bg-[#090909]/80 px-3 py-2">
      <div className="terminal-text text-[9px] tracking-widest uppercase text-[#444]">{label}</div>
      <div className="terminal-text text-sm font-semibold text-white/80">{value}</div>
      <div className={`terminal-text text-[10px] ${positive ? "text-green-primary" : "text-danger"}`}>
        {formatPct(delta)}
      </div>
    </div>
  );
}

function Feature({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded border border-white/[0.06] bg-[#0a0a0a] p-4">
      <div className="inline-flex items-center gap-2 mb-2 text-green-primary/80 terminal-text text-[10px] tracking-widest uppercase">
        {icon}
        Core
      </div>
      <h3 className="text-sm font-semibold text-white/85 mb-1">{title}</h3>
      <p className="text-[12px] text-[#777] leading-relaxed">{body}</p>
    </div>
  );
}

function ScoreLine({
  name,
  weight,
  desc,
}: {
  name: string;
  weight: string;
  desc: string;
}) {
  return (
    <div className="rounded border border-white/[0.05] bg-[#0a0a0a] p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="terminal-text text-[11px] text-white/80">{name}</span>
        <span className="terminal-text text-[10px] text-green-primary">{weight}</span>
      </div>
      <p className="text-[12px] text-[#777]">{desc}</p>
    </div>
  );
}

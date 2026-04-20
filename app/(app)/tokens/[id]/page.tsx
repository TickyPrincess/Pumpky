import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Twitter,
  Send,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  fetchToken,
  fetchPriceChart,
  fetchVolumeChart,
  fetchComparables,
} from "@/lib/data/provider";
import { TerminalPanel } from "@/components/terminal/terminal-panel";
import { ScoreRing } from "@/components/terminal/score-ring";
import { ScoreRadar } from "@/components/charts/score-radar";
import { PriceChart } from "@/components/charts/price-chart";
import { VolumeChart } from "@/components/charts/volume-chart";
import { TokenCard } from "@/components/tokens/token-card";
import { WatchlistToggle } from "@/components/watchlist/watchlist-toggle";
import {
  formatPrice,
  formatPct,
  formatNumber,
  chainToColor,
  shortAddress,
  formatAge,
  bsRatioLabel,
  bsRatioColor,
  cn,
  verdictToColor,
  verdictToLabel,
} from "@/lib/utils";

interface TokenPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TokenPageProps) {
  const { id } = await params;
  const token = await fetchToken(id);
  if (!token) return { title: "Token Not Found" };
  return {
    title: `${token.symbol} — ${token.name}`,
    description: token.aiSummary.headline,
  };
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { id } = await params;

  const [token, priceData, volumeData, comparables] = await Promise.all([
    fetchToken(id),
    fetchPriceChart(id, "24h"),
    fetchVolumeChart(id),
    fetchComparables(id),
  ]);

  if (!token) notFound();

  const isUp = token.priceChange24h >= 0;

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.04] bg-[#070707]">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 terminal-text text-[11px] text-[#444] hover:text-[#888] transition-colors"
          >
            <ArrowLeft size={12} />
            Back
          </Link>
          <span className="text-[#2a2a2a]">/</span>
          <span className="terminal-text text-[11px] text-[#444]">
            Tokens
          </span>
          <span className="text-[#2a2a2a]">/</span>
          <span className="terminal-text text-[11px] text-green-primary/60">
            {token.symbol}
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold terminal-text"
              style={{
                background: "rgba(0,255,65,0.08)",
                border: "1px solid rgba(0,255,65,0.15)",
                color: "var(--green-primary)",
              }}
            >
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold text-white/90 tracking-tight">
                  {token.symbol}
                </h1>
                <span
                  className={cn(
                    "terminal-text text-xs font-medium px-1.5 py-0.5 rounded border",
                    chainToColor(token.chain)
                  )}
                  style={{ borderColor: "currentColor", opacity: 0.6 }}
                >
                  {token.chain}
                </span>
              </div>
              <p className="text-sm text-[#555]">{token.name}</p>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="text-2xl font-bold terminal-text text-white/80">
              {formatPrice(token.price)}
            </div>
            <span
              className={cn(
                "terminal-text text-sm font-medium",
                isUp ? "text-green-primary" : "text-danger"
              )}
            >
              {formatPct(token.priceChange24h)} (24h)
            </span>
            <div className="flex justify-end">
              <WatchlistToggle token={token} showLabel />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-5">
        {/* Top row: scores + chart */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Score rings */}
          <div className="xl:col-span-3">
            <TerminalPanel title="Score Overview" status="demo" noPadding>
              <div className="p-4 space-y-4">
                {/* Main score */}
                <div className="flex justify-center pt-2">
                  <ScoreRing
                    score={token.scores.opportunity}
                    size="lg"
                    label="Opportunity"
                  />
                </div>

                {/* Sub scores */}
                <div className="grid grid-cols-2 gap-3">
                  <ScoreRing
                    score={token.scores.momentum}
                    size="sm"
                    label="Momentum"
                  />
                  <ScoreRing
                    score={token.scores.risk}
                    size="sm"
                    label="Risk"
                    invert
                  />
                  <ScoreRing
                    score={token.scores.sentiment}
                    size="sm"
                    label="Sentiment"
                  />
                  <ScoreRing
                    score={token.scores.liquidity}
                    size="sm"
                    label="Liquidity"
                  />
                </div>

                {/* Verdict */}
                <div className="text-center pt-1">
                  <span
                    className={cn(
                      "terminal-text text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded",
                      verdictToColor(token.aiSummary.verdict)
                    )}
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    {verdictToLabel(token.aiSummary.verdict)}
                  </span>
                </div>
              </div>
            </TerminalPanel>
          </div>

          {/* Price chart */}
          <div className="xl:col-span-6">
            <TerminalPanel
              title="Price"
              subtitle="24h"
              status="demo"
              noPadding
            >
              <div className="p-4">
                <PriceChart
                  data={priceData}
                  isPositive={isUp}
                  height={220}
                />
              </div>
            </TerminalPanel>
          </div>

          {/* Stats */}
          <div className="xl:col-span-3">
            <TerminalPanel title="Market Data" status="demo" noPadding>
              <div className="p-4 space-y-3">
                {[
                  { label: "Market Cap", value: formatNumber(token.marketCap, { prefix: "$" }) },
                  { label: "FDV", value: formatNumber(token.fdv, { prefix: "$" }) },
                  { label: "Liquidity", value: formatNumber(token.liquidity, { prefix: "$" }) },
                  { label: "24h Volume", value: formatNumber(token.volume24h, { prefix: "$" }) },
                  { label: "Holders", value: formatNumber(token.holders) },
                  { label: "Age", value: formatAge(token.age) },
                  { label: "Buys 24h", value: token.buys24h.toLocaleString() },
                  { label: "Sells 24h", value: token.sells24h.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="terminal-text text-[10px] text-[#444]">
                      {label}
                    </span>
                    <span className="terminal-text text-[11px] text-white/60">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="terminal-text text-[10px] text-[#444]">
                      Buy Pressure
                    </span>
                    <span
                      className={cn(
                        "terminal-text text-[10px] font-semibold",
                        bsRatioColor(token.buys24h, token.sells24h)
                      )}
                    >
                      {bsRatioLabel(token.buys24h, token.sells24h)}
                    </span>
                  </div>
                </div>
              </div>
            </TerminalPanel>
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* AI Summary */}
          <div className="xl:col-span-5">
            <TerminalPanel title="AI Analysis" subtitle="generated" status="demo">
              <div className="space-y-4">
                <p className="text-sm text-white/70 leading-relaxed">
                  {token.aiSummary.headline}
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="terminal-text text-[10px] text-green-primary/60 tracking-widest uppercase mb-1.5">
                      Bull Case
                    </div>
                    <p className="text-[12px] text-[#666] leading-relaxed">
                      {token.aiSummary.bullCase}
                    </p>
                  </div>

                  <div>
                    <div className="terminal-text text-[10px] text-danger/60 tracking-widest uppercase mb-1.5">
                      Bear Case
                    </div>
                    <p className="text-[12px] text-[#666] leading-relaxed">
                      {token.aiSummary.bearCase}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="terminal-text text-[10px] text-green-primary/60 tracking-widest uppercase mb-2">
                      Why Pump
                    </div>
                    <ul className="space-y-1">
                      {token.aiSummary.whyPump.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5"
                        >
                          <Zap size={9} className="text-green-primary/40 mt-0.5 flex-shrink-0" />
                          <span className="terminal-text text-[10px] text-[#555]">
                            {r}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="terminal-text text-[10px] text-danger/60 tracking-widest uppercase mb-2">
                      Why Dump
                    </div>
                    <ul className="space-y-1">
                      {token.aiSummary.whyDump.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle
                            size={9}
                            className="text-danger/40 mt-0.5 flex-shrink-0"
                          />
                          <span className="terminal-text text-[10px] text-[#555]">
                            {r}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] terminal-text text-[9px] text-[#222]">
                  DISCLAIMER: This is algorithmic analysis only. Not financial advice. DYOR.
                </div>
              </div>
            </TerminalPanel>
          </div>

          {/* Contract & Risk */}
          <div className="xl:col-span-4">
            <TerminalPanel title="Contract Analysis" status="demo">
              <div className="space-y-3">
                <ContractField
                  label="Verified"
                  ok={token.contractData.verified}
                />
                <ContractField
                  label="Mintable"
                  ok={!token.contractData.mintable}
                  invert
                />
                <ContractField
                  label="Freezable"
                  ok={!token.contractData.freezable}
                  invert
                />
                <ContractField
                  label="Renounced"
                  ok={token.contractData.renounced}
                />
                <ContractField
                  label="Liquidity Locked"
                  ok={token.contractData.lockedLiquidityPct > 50}
                  suffix={`${token.contractData.lockedLiquidityPct}%`}
                />
                <ContractField
                  label="Honeypot"
                  ok={!token.contractData.honeypotRisk}
                  invert
                />

                <div className="pt-2 border-t border-white/[0.04] space-y-2">
                  <div className="flex justify-between">
                    <span className="terminal-text text-[10px] text-[#444]">
                      Top 10 Holders
                    </span>
                    <span
                      className={cn(
                        "terminal-text text-[11px]",
                        token.contractData.topHoldersPct > 40
                          ? "text-danger"
                          : token.contractData.topHoldersPct > 25
                          ? "text-yellow-400"
                          : "text-green-primary"
                      )}
                    >
                      {token.contractData.topHoldersPct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="terminal-text text-[10px] text-[#444]">
                      Sniper Wallets
                    </span>
                    <span
                      className={cn(
                        "terminal-text text-[11px]",
                        token.contractData.sniperPct > 15
                          ? "text-danger"
                          : token.contractData.sniperPct > 8
                          ? "text-yellow-400"
                          : "text-green-primary"
                      )}
                    >
                      {token.contractData.sniperPct}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="terminal-text text-[10px] text-[#444]">
                      Dev Wallet
                    </span>
                    <span
                      className={cn(
                        "terminal-text text-[11px]",
                        token.contractData.devWalletPct > 5
                          ? "text-warning"
                          : "text-green-primary"
                      )}
                    >
                      {token.contractData.devWalletPct}%
                    </span>
                  </div>
                </div>

                {token.contractData.warnings.length > 0 && (
                  <div className="pt-2 border-t border-warning/10">
                    <div className="terminal-text text-[10px] text-warning/60 tracking-widest uppercase mb-2">
                      Warnings
                    </div>
                    <ul className="space-y-1">
                      {token.contractData.warnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle
                            size={9}
                            className="text-warning/50 mt-0.5 flex-shrink-0"
                          />
                          <span className="terminal-text text-[10px] text-warning/50">
                            {w}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TerminalPanel>
          </div>

          {/* Score radar */}
          <div className="xl:col-span-3">
            <TerminalPanel title="Score Radar" status="demo">
              <ScoreRadar scores={token.scores} size={200} />
            </TerminalPanel>
          </div>
        </div>

        <TerminalPanel title="Volume + Liquidity" subtitle="execution context" status="demo">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <VolumeChart data={volumeData} height={170} />
            </div>
            <div className="lg:col-span-4 space-y-2">
              <KeyValue label="24h Volume Change" value={formatPct(token.volumeChange24h)} positive={token.volumeChange24h >= 0} />
              <KeyValue label="Liquidity / MCap" value={`${((token.liquidity / token.marketCap) * 100).toFixed(2)}%`} />
              <KeyValue label="Liquidity Locked" value={`${token.contractData.lockedLiquidityPct}%`} positive={token.contractData.lockedLiquidityPct >= 60} />
              <KeyValue label="Transactions 24h" value={formatNumber(token.transactions24h)} />
              <KeyValue label="Most likely move" value={token.trendDirection.toUpperCase()} positive={token.trendDirection === "up"} />
            </div>
          </div>
        </TerminalPanel>

        {/* Social metrics */}
        <TerminalPanel title="Social Signals" status="demo">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <SocialMetric
              label="Twitter Followers"
              value={formatNumber(token.socialMetrics.twitterFollowers)}
            />
            <SocialMetric
              label="Mentions 24h"
              value={formatNumber(token.socialMetrics.twitterMentions24h)}
            />
            <SocialMetric
              label="Twitter Sentiment"
              value={token.socialMetrics.twitterSentiment >= 0 ? `+${(token.socialMetrics.twitterSentiment * 100).toFixed(0)}%` : `${(token.socialMetrics.twitterSentiment * 100).toFixed(0)}%`}
              positive={token.socialMetrics.twitterSentiment >= 0}
            />
            <SocialMetric
              label="TG Members"
              value={formatNumber(token.socialMetrics.telegramMembers)}
            />
            <SocialMetric
              label="TG Activity"
              value={token.socialMetrics.telegramActivity.toUpperCase()}
            />
            <SocialMetric
              label="Narrative Heat"
              value={`${token.socialMetrics.narrativeHeat}/100`}
            />
          </div>
        </TerminalPanel>

        {/* Comparables */}
        {comparables.length > 0 && (
          <TerminalPanel title="Similar Tokens" subtitle="same chain & mcap range" status="demo">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {comparables.map((t) => (
                <TokenCard key={t.id} token={t} compact />
              ))}
            </div>
          </TerminalPanel>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pb-4">
          <span className="terminal-text text-[10px] text-[#333] tracking-widest uppercase">
            Links:
          </span>
          {token.website && (
            <Link href={token.website} target="_blank" rel="noreferrer noopener">
              <ExternalLink
                size={13}
                className="text-[#333] hover:text-[#666] cursor-pointer transition-colors"
              />
            </Link>
          )}
          {token.twitter && (
            <Link
              href={`https://x.com/${token.twitter.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Twitter
                size={13}
                className="text-[#333] hover:text-[#4a9edd] cursor-pointer transition-colors"
              />
            </Link>
          )}
          {token.telegram && (
            <Link
              href={`https://t.me/${token.telegram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Send
                size={13}
                className="text-[#333] hover:text-[#4a9edd] cursor-pointer transition-colors"
              />
            </Link>
          )}
          <span className="terminal-text text-[10px] text-[#222] ml-2">
            {shortAddress(token.address)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContractField({
  label,
  ok,
  invert,
  suffix,
}: {
  label: string;
  ok: boolean;
  invert?: boolean;
  suffix?: string;
}) {
  const isGood = invert ? !ok : ok;
  return (
    <div className="flex items-center justify-between">
      <span className="terminal-text text-[11px] text-[#555]">{label}</span>
      <div className="flex items-center gap-1.5">
        {suffix && (
          <span className="terminal-text text-[11px] text-[#555]">
            {suffix}
          </span>
        )}
        {isGood ? (
          <CheckCircle size={11} className="text-green-primary" />
        ) : (
          <AlertTriangle size={11} className="text-warning" />
        )}
      </div>
    </div>
  );
}

function SocialMetric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="terminal-text text-[9px] text-[#333] tracking-widest uppercase">
        {label}
      </div>
      <div
        className={cn(
          "terminal-text text-sm font-semibold",
          positive === true
            ? "text-green-primary"
            : positive === false
            ? "text-danger"
            : "text-white/60"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function KeyValue({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5 last:border-0 last:pb-0">
      <span className="terminal-text text-[10px] text-[#444]">{label}</span>
      <span
        className={cn(
          "terminal-text text-[11px]",
          positive === true
            ? "text-green-primary"
            : positive === false
            ? "text-danger"
            : "text-white/70"
        )}
      >
        {value}
      </span>
    </div>
  );
}

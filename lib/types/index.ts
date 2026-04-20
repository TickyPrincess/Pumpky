// ============================================================
// PUMPKY — Core Type Definitions
// ============================================================

export type Chain = "SOL" | "ETH" | "BSC" | "BASE" | "AVAX";

export type TokenTag =
  | "trending"
  | "new"
  | "risky"
  | "high-conviction"
  | "defi"
  | "meme"
  | "ai"
  | "gaming"
  | "degen"
  | "blue-chip-meme"
  | "rug-risk"
  | "whale-watch"
  | "momentum";

export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type TrendDirection = "up" | "down" | "sideways";
export type SignalStrength = "strong" | "moderate" | "weak";

// ------------------------------------------------------------
// Token Scoring Model
// ------------------------------------------------------------
// Each score is 0-100. Higher opportunity = more attractive.
// Higher risk = more dangerous. All scores are composites.

export interface TokenScores {
  // Composite opportunity score (weighted sum of positive signals)
  opportunity: number;

  // Risk score: holder concentration + contract flags + rug indicators
  risk: number;

  // Momentum: price acceleration + volume surge + buy/sell ratio
  momentum: number;

  // Sentiment: social mentions + narrative heat + community size
  sentiment: number;

  // Liquidity: DEX depth + liquidity/mcap ratio + slippage estimate
  liquidity: number;
}

export interface ScoreBreakdown {
  factor: string;
  value: number;
  weight: number;
  contribution: number;
  signal: "positive" | "negative" | "neutral";
}

// ------------------------------------------------------------
// Social & On-Chain Metrics
// ------------------------------------------------------------

export interface SocialMetrics {
  twitterFollowers: number;
  twitterMentions24h: number;
  twitterSentiment: number; // -1 to 1
  telegramMembers: number;
  telegramActivity: "dead" | "low" | "moderate" | "high" | "viral";
  redditMentions24h: number;
  narrativeHeat: number; // 0-100
  influencerMentions: number;
}

export interface ContractData {
  verified: boolean;
  mintable: boolean;
  freezable: boolean;
  renounced: boolean;
  topHoldersPct: number; // % held by top 10 wallets
  sniperPct: number;     // % held by snipers
  devWalletPct: number;  // % held by dev/team
  lockedLiquidityPct: number;
  lockExpiry: string | null;
  honeypotRisk: boolean;
  warnings: string[];
}

// ------------------------------------------------------------
// Core Token Type
// ------------------------------------------------------------

export interface Token {
  id: string;
  symbol: string;
  name: string;
  chain: Chain;
  address: string;
  logoUrl: string | null;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
  description: string | null;

  // Price data
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  allTimeHigh: number;
  allTimeLow: number;

  // Market data
  marketCap: number;
  fdv: number;
  volume24h: number;
  volumeChange24h: number; // vs previous 24h
  liquidity: number;

  // On-chain
  holders: number;
  transactions24h: number;
  buys24h: number;
  sells24h: number;
  age: number; // days since launch

  // Scores
  scores: TokenScores;

  // AI analysis
  aiSummary: AISummary;

  // Flags
  redFlags: string[];
  catalysts: string[];
  tags: TokenTag[];

  // Enrichment
  socialMetrics: SocialMetrics;
  contractData: ContractData;

  // Metadata
  launchedAt: string | null;
  updatedAt: string;
  trendDirection: TrendDirection;
}

// ------------------------------------------------------------
// AI Summary
// ------------------------------------------------------------

export interface AISummary {
  headline: string;
  bullCase: string;
  bearCase: string;
  whyPump: string[];
  whyDump: string[];
  verdict: "watch" | "buy-signal" | "avoid" | "high-risk" | "degen-play";
  confidence: number; // 0-100
  lastUpdated: string;
}

// ------------------------------------------------------------
// Watchlist
// ------------------------------------------------------------

export interface WatchlistItem {
  id: string;
  tokenId: string;
  token: Token;
  notes: string | null;
  tags: string[];
  addedAt: string;
  scoreAtAdd: number;
  currentScore: number;
  scoreDelta: number;
}

// ------------------------------------------------------------
// Market Overview
// ------------------------------------------------------------

export interface MarketOverview {
  totalMcap: number;
  mcapChange24h: number;
  totalVolume24h: number;
  volumeChange24h: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
  topGainer: Token;
  topLoser: Token;
  mostActive: Token;
  trendingSentiment: "bullish" | "bearish" | "neutral";
  narratives: Narrative[];
}

export interface Narrative {
  name: string;
  momentum: number; // 0-100
  tokenCount: number;
  avgPerformance24h: number;
}

// ------------------------------------------------------------
// Filter / Sort State
// ------------------------------------------------------------

export interface TokenFilters {
  chain: Chain | "all";
  minOpportunity: number;
  maxRisk: number;
  minMarketCap: number;
  maxMarketCap: number;
  minVolume: number;
  tags: TokenTag[];
  sortBy: TokenSortKey;
  sortDir: "asc" | "desc";
  search: string;
}

export type TokenSortKey =
  | "opportunity"
  | "risk"
  | "momentum"
  | "priceChange24h"
  | "volume24h"
  | "marketCap"
  | "liquidity"
  | "holders"
  | "age";

// ------------------------------------------------------------
// Chart Data
// ------------------------------------------------------------

export interface PricePoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

// ------------------------------------------------------------
// API Response Wrappers
// ------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  source: "live" | "demo";
  cached: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * PUMPKY Mock Data Provider
 * =========================
 * All data access flows through this provider.
 * Set USE_LIVE_DATA=true and implement the live provider
 * to swap to real API data without changing consuming code.
 */

import type {
  Token,
  MarketOverview,
  TokenFilters,
  PaginatedResponse,
  ChartDataPoint,
  Narrative,
} from "@/lib/types";
import {
  DEMO_TOKENS,
  getTokenById,
  TRENDING_TOKENS,
  TOP_OPPORTUNITIES,
} from "./demo-tokens";
import { generatePriceHistory } from "@/lib/utils";

// Simulate network latency in dev
function delay(ms = 200): Promise<void> {
  if (process.env.NODE_ENV === "production") return Promise.resolve();
  return new Promise((r) => setTimeout(r, ms));
}

// ------------------------------------------------------------
// Token Queries
// ------------------------------------------------------------

export async function fetchTokens(
  filters: Partial<TokenFilters> = {}
): Promise<PaginatedResponse<Token>> {
  await delay(120);

  let tokens = [...DEMO_TOKENS];

  // Chain filter
  if (filters.chain && filters.chain !== "all") {
    tokens = tokens.filter((t) => t.chain === filters.chain);
  }

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase();
    tokens = tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
    );
  }

  // Score filters
  if (filters.minOpportunity !== undefined) {
    tokens = tokens.filter(
      (t) => t.scores.opportunity >= filters.minOpportunity!
    );
  }
  if (filters.maxRisk !== undefined) {
    tokens = tokens.filter((t) => t.scores.risk <= filters.maxRisk!);
  }

  // MarketCap filters
  if (filters.minMarketCap !== undefined) {
    tokens = tokens.filter((t) => t.marketCap >= filters.minMarketCap!);
  }
  if (filters.maxMarketCap !== undefined) {
    tokens = tokens.filter((t) => t.marketCap <= filters.maxMarketCap!);
  }

  // Volume filter
  if (filters.minVolume !== undefined) {
    tokens = tokens.filter((t) => t.volume24h >= filters.minVolume!);
  }

  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    tokens = tokens.filter((t) =>
      filters.tags!.some((tag) => t.tags.includes(tag))
    );
  }

  // Sort
  const sortBy = filters.sortBy ?? "opportunity";
  const sortDir = filters.sortDir ?? "desc";
  tokens.sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (sortBy) {
      case "opportunity":
        aVal = a.scores.opportunity;
        bVal = b.scores.opportunity;
        break;
      case "risk":
        aVal = a.scores.risk;
        bVal = b.scores.risk;
        break;
      case "momentum":
        aVal = a.scores.momentum;
        bVal = b.scores.momentum;
        break;
      case "priceChange24h":
        aVal = a.priceChange24h;
        bVal = b.priceChange24h;
        break;
      case "volume24h":
        aVal = a.volume24h;
        bVal = b.volume24h;
        break;
      case "marketCap":
        aVal = a.marketCap;
        bVal = b.marketCap;
        break;
      case "liquidity":
        aVal = a.liquidity;
        bVal = b.liquidity;
        break;
      case "holders":
        aVal = a.holders;
        bVal = b.holders;
        break;
      case "age":
        aVal = a.age;
        bVal = b.age;
        break;
      default:
        aVal = a.scores.opportunity;
        bVal = b.scores.opportunity;
    }

    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const page = 1;
  const pageSize = 50;
  const total = tokens.length;

  return {
    items: tokens.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    hasMore: total > page * pageSize,
  };
}

export async function fetchToken(id: string): Promise<Token | null> {
  await delay(80);
  return getTokenById(id) ?? null;
}

export async function fetchTrendingTokens(limit = 5): Promise<Token[]> {
  await delay(80);
  return TRENDING_TOKENS.slice(0, limit);
}

export async function fetchTopOpportunities(limit = 5): Promise<Token[]> {
  await delay(80);
  return TOP_OPPORTUNITIES.slice(0, limit);
}

// ------------------------------------------------------------
// Market Overview
// ------------------------------------------------------------

export async function fetchMarketOverview(): Promise<MarketOverview> {
  await delay(150);

  const totalMcap = DEMO_TOKENS.reduce((acc, t) => acc + t.marketCap, 0);
  const totalVolume = DEMO_TOKENS.reduce((acc, t) => acc + t.volume24h, 0);

  const sorted24h = [...DEMO_TOKENS].sort(
    (a, b) => b.priceChange24h - a.priceChange24h
  );

  const narratives: Narrative[] = [
    {
      name: "AI Memes",
      momentum: 91,
      tokenCount: 3,
      avgPerformance24h: 48.2,
    },
    {
      name: "BASE Ecosystem",
      momentum: 78,
      tokenCount: 2,
      avgPerformance24h: 28.1,
    },
    {
      name: "Animal Coins",
      momentum: 72,
      tokenCount: 4,
      avgPerformance24h: 38.4,
    },
    {
      name: "SOL Memes",
      momentum: 84,
      tokenCount: 5,
      avgPerformance24h: 42.1,
    },
    {
      name: "ETH OG Memes",
      momentum: 52,
      tokenCount: 3,
      avgPerformance24h: 8.7,
    },
  ];

  return {
    totalMcap,
    mcapChange24h: 12.4,
    totalVolume24h: totalVolume,
    volumeChange24h: 84.2,
    fearGreedIndex: 74,
    fearGreedLabel: "Greed",
    topGainer: sorted24h[0],
    topLoser: sorted24h[sorted24h.length - 1],
    mostActive: [...DEMO_TOKENS].sort((a, b) => b.volume24h - a.volume24h)[0],
    trendingSentiment: "bullish",
    narratives,
  };
}

// ------------------------------------------------------------
// Chart Data
// ------------------------------------------------------------

export async function fetchPriceChart(
  tokenId: string,
  timeframe: "1h" | "4h" | "24h" | "7d" | "30d" = "24h"
): Promise<ChartDataPoint[]> {
  await delay(100);

  const token = getTokenById(tokenId);
  if (!token) return [];

  const pointsMap = { "1h": 60, "4h": 48, "24h": 24, "7d": 168, "30d": 30 };
  const points = pointsMap[timeframe];
  const volatility = Math.abs(token.priceChange24h) / 100 + 0.02;
  const trend = token.priceChange24h / (points * 10);

  return generatePriceHistory(token.price, points, volatility, trend).map(
    (p) => ({ time: p.time, value: p.value })
  );
}

export async function fetchVolumeChart(
  tokenId: string,
  timeframe: "24h" | "7d" = "24h"
): Promise<ChartDataPoint[]> {
  await delay(80);

  const token = getTokenById(tokenId);
  if (!token) return [];

  const points = timeframe === "24h" ? 24 : 7;
  const baseVolume = token.volume24h / 24;

  return Array.from({ length: points }, (_, i) => {
    const variance = 0.4;
    const vol = baseVolume * (1 + (Math.random() - 0.5) * variance);
    return {
      time: new Date(Date.now() - (points - i) * 60 * 60 * 1000).toISOString(),
      value: Math.max(0, vol),
    };
  });
}

// ------------------------------------------------------------
// Search
// ------------------------------------------------------------

export async function searchTokens(query: string): Promise<Token[]> {
  if (!query || query.length < 2) return [];
  await delay(50);

  const q = query.toLowerCase();
  return DEMO_TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
  ).slice(0, 8);
}

// ------------------------------------------------------------
// Comparable tokens (for token detail page)
// ------------------------------------------------------------

export async function fetchComparables(tokenId: string): Promise<Token[]> {
  await delay(100);

  const token = getTokenById(tokenId);
  if (!token) return [];

  return DEMO_TOKENS.filter(
    (t) =>
      t.id !== tokenId &&
      t.chain === token.chain &&
      Math.abs(t.marketCap - token.marketCap) / token.marketCap < 5
  ).slice(0, 4);
}

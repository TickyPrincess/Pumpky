import * as mock from "@/lib/data/mock-provider";
import * as live from "@/lib/data/live-provider";

export type ProviderMode = "demo" | "live";

export const PROVIDER_MODE: ProviderMode =
  process.env.USE_LIVE_DATA === "true" ? "live" : "demo";

const provider: typeof mock = PROVIDER_MODE === "live" ? (live as typeof mock) : mock;

export const fetchTokens = provider.fetchTokens;
export const fetchToken = provider.fetchToken;
export const fetchTrendingTokens = provider.fetchTrendingTokens;
export const fetchTopOpportunities = provider.fetchTopOpportunities;
export const fetchMarketOverview = provider.fetchMarketOverview;
export const fetchPriceChart = provider.fetchPriceChart;
export const fetchVolumeChart = provider.fetchVolumeChart;
export const fetchComparables = provider.fetchComparables;
export const searchTokens = provider.searchTokens;

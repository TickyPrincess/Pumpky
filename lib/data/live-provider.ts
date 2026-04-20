/**
 * PUMPKY Live Data Provider (scaffold)
 * ------------------------------------
 * This layer is intentionally thin right now.
 * It keeps the same contract as the mock provider so you can switch
 * to real APIs without touching UI code.
 */

import * as mock from "@/lib/data/mock-provider";

const LIVE_WARNING =
  "[Pumpky] USE_LIVE_DATA=true but live adapters are not wired yet. Falling back to demo provider.";

let warned = false;

function warnOnce() {
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn(LIVE_WARNING);
    warned = true;
  }
}

export async function fetchTokens(...args: Parameters<typeof mock.fetchTokens>) {
  warnOnce();
  return mock.fetchTokens(...args);
}

export async function fetchToken(...args: Parameters<typeof mock.fetchToken>) {
  warnOnce();
  return mock.fetchToken(...args);
}

export async function fetchTrendingTokens(
  ...args: Parameters<typeof mock.fetchTrendingTokens>
) {
  warnOnce();
  return mock.fetchTrendingTokens(...args);
}

export async function fetchTopOpportunities(
  ...args: Parameters<typeof mock.fetchTopOpportunities>
) {
  warnOnce();
  return mock.fetchTopOpportunities(...args);
}

export async function fetchMarketOverview(
  ...args: Parameters<typeof mock.fetchMarketOverview>
) {
  warnOnce();
  return mock.fetchMarketOverview(...args);
}

export async function fetchPriceChart(...args: Parameters<typeof mock.fetchPriceChart>) {
  warnOnce();
  return mock.fetchPriceChart(...args);
}

export async function fetchVolumeChart(...args: Parameters<typeof mock.fetchVolumeChart>) {
  warnOnce();
  return mock.fetchVolumeChart(...args);
}

export async function fetchComparables(...args: Parameters<typeof mock.fetchComparables>) {
  warnOnce();
  return mock.fetchComparables(...args);
}

export async function searchTokens(...args: Parameters<typeof mock.searchTokens>) {
  warnOnce();
  return mock.searchTokens(...args);
}

/**
 * PUMPKY Scoring Engine
 * =====================
 * Computes opportunity, risk, momentum, sentiment, and liquidity scores
 * for meme coin tokens. All scores are 0-100.
 *
 * Scoring Philosophy:
 * - Opportunity Score: signal of potential upside (higher = more attractive)
 * - Risk Score: aggregate danger level (higher = more dangerous)
 * - Momentum Score: price + volume acceleration (higher = more momentum)
 * - Sentiment Score: social signals (higher = more bullish sentiment)
 * - Liquidity Score: DEX depth and stability (higher = safer liquidity)
 *
 * Each factor has a defined weight. Factors are normalized to 0-100 before weighting.
 * This is an analytics tool — not financial advice.
 */

import type { Token, TokenScores, ScoreBreakdown } from "@/lib/types";
import { clamp } from "@/lib/utils";

// ------------------------------------------------------------
// Factor weights (must sum to 1.0 per score category)
// ------------------------------------------------------------

export const OPPORTUNITY_WEIGHTS = {
  momentum: 0.30,
  liquidityScore: 0.20,
  socialTraction: 0.20,
  volumeAcceleration: 0.15,
  narrativeHeat: 0.15,
};

export const RISK_WEIGHTS = {
  holderConcentration: 0.25,
  contractFlags: 0.20,
  liquidityRisk: 0.20,
  rugIndicators: 0.15,
  volatility: 0.10,
  ageRisk: 0.10,
};

export const MOMENTUM_WEIGHTS = {
  priceAcceleration: 0.40,
  volumeSurge: 0.30,
  buySellRatio: 0.20,
  txAcceleration: 0.10,
};

export const SENTIMENT_WEIGHTS = {
  twitterTraction: 0.30,
  telegramActivity: 0.25,
  influencerMentions: 0.20,
  narrativeAlignment: 0.15,
  redditMentions: 0.10,
};

export const LIQUIDITY_WEIGHTS = {
  absoluteLiquidity: 0.35,
  liquidityToMcapRatio: 0.30,
  lockedLiquidity: 0.20,
  dexDepth: 0.15,
};

// ------------------------------------------------------------
// Individual factor calculators
// ------------------------------------------------------------

function calcMomentumScore(token: Partial<Token>): number {
  const factors: ScoreBreakdown[] = [];

  // Price acceleration (1h + 24h weighted)
  const priceScore = clamp(
    ((token.priceChange1h ?? 0) * 3 + (token.priceChange24h ?? 0)) / 4,
    -50,
    50
  );
  factors.push({
    factor: "priceAcceleration",
    value: priceScore,
    weight: MOMENTUM_WEIGHTS.priceAcceleration,
    contribution: 0,
    signal: priceScore > 0 ? "positive" : "negative",
  });

  // Volume surge vs 24h average
  const volChange = token.volumeChange24h ?? 0;
  const volScore = clamp(volChange / 2, -50, 50);
  factors.push({
    factor: "volumeSurge",
    value: volScore,
    weight: MOMENTUM_WEIGHTS.volumeSurge,
    contribution: 0,
    signal: volScore > 0 ? "positive" : "negative",
  });

  // Buy/sell ratio
  const buys = token.buys24h ?? 0;
  const sells = token.sells24h ?? 1;
  const ratio = buys / sells;
  const bsScore = clamp((ratio - 1) * 25, -50, 50);
  factors.push({
    factor: "buySellRatio",
    value: bsScore,
    weight: MOMENTUM_WEIGHTS.buySellRatio,
    contribution: 0,
    signal: bsScore > 0 ? "positive" : "negative",
  });

  // Transaction acceleration
  const txScore = clamp(((token.transactions24h ?? 0) / 1000) * 25, 0, 50);
  factors.push({
    factor: "txAcceleration",
    value: txScore,
    weight: MOMENTUM_WEIGHTS.txAcceleration,
    contribution: 0,
    signal: "neutral",
  });

  const weighted = factors.reduce((acc, f) => {
    const normalized = (f.value + 50) * (100 / 100);
    return acc + normalized * f.weight;
  }, 0);

  return clamp(weighted, 0, 100);
}

function calcSentimentScore(token: Partial<Token>): number {
  const social = token.socialMetrics;
  if (!social) return 50;

  // Twitter traction
  const twitterScore = clamp(
    (social.twitterMentions24h / 1000) * 50 +
      social.twitterSentiment * 25 +
      25,
    0,
    100
  );

  // Telegram activity
  const telegramMap: Record<string, number> = {
    dead: 0, low: 20, moderate: 50, high: 75, viral: 100,
  };
  const telegramScore = telegramMap[social.telegramActivity] ?? 50;

  // Influencer mentions
  const influencerScore = clamp(social.influencerMentions * 15, 0, 100);

  // Narrative heat
  const narrativeScore = social.narrativeHeat;

  // Reddit
  const redditScore = clamp((social.redditMentions24h / 100) * 100, 0, 100);

  return clamp(
    twitterScore * SENTIMENT_WEIGHTS.twitterTraction +
      telegramScore * SENTIMENT_WEIGHTS.telegramActivity +
      influencerScore * SENTIMENT_WEIGHTS.influencerMentions +
      narrativeScore * SENTIMENT_WEIGHTS.narrativeAlignment +
      redditScore * SENTIMENT_WEIGHTS.redditMentions,
    0,
    100
  );
}

function calcLiquidityScore(token: Partial<Token>): number {
  const liquidity = token.liquidity ?? 0;
  const mcap = token.marketCap ?? 1;
  const contract = token.contractData;

  // Absolute liquidity (log scale: 10K=20, 100K=50, 1M=75, 10M=100)
  const absScore = clamp(Math.log10(Math.max(liquidity, 1)) * 12.5, 0, 100);

  // Liquidity/mcap ratio (healthy = 5-20%)
  const ratio = (liquidity / mcap) * 100;
  const ratioScore = clamp(
    ratio < 5 ? ratio * 10 : ratio < 20 ? 80 + (ratio - 5) : 80,
    0,
    100
  );

  // Locked liquidity bonus
  const lockedPct = contract?.lockedLiquidityPct ?? 0;
  const lockedScore = clamp(lockedPct * 1.2, 0, 100);

  // DEX depth proxy (using volume/liquidity ratio)
  const volume = token.volume24h ?? 0;
  const dexScore = clamp((volume / Math.max(liquidity, 1)) * 50, 0, 100);

  return clamp(
    absScore * LIQUIDITY_WEIGHTS.absoluteLiquidity +
      ratioScore * LIQUIDITY_WEIGHTS.liquidityToMcapRatio +
      lockedScore * LIQUIDITY_WEIGHTS.lockedLiquidity +
      dexScore * LIQUIDITY_WEIGHTS.dexDepth,
    0,
    100
  );
}

function calcRiskScore(token: Partial<Token>): number {
  const contract = token.contractData;
  let riskPoints = 0;

  // Holder concentration risk
  const topHolderPct = contract?.topHoldersPct ?? 50;
  const holderRisk = clamp((topHolderPct / 100) * 100, 0, 100);
  riskPoints += holderRisk * RISK_WEIGHTS.holderConcentration;

  // Contract flags
  let contractFlags = 0;
  if (contract?.mintable) contractFlags += 25;
  if (contract?.freezable) contractFlags += 20;
  if (!contract?.renounced) contractFlags += 15;
  if (contract?.honeypotRisk) contractFlags += 40;
  contractFlags = clamp(contractFlags, 0, 100);
  riskPoints += contractFlags * RISK_WEIGHTS.contractFlags;

  // Liquidity risk (inverse of liquidity score)
  const liqScore = calcLiquidityScore(token);
  riskPoints += (100 - liqScore) * RISK_WEIGHTS.liquidityRisk;

  // Rug indicators
  let rugRisk = 0;
  if ((contract?.devWalletPct ?? 0) > 10) rugRisk += 30;
  if ((contract?.sniperPct ?? 0) > 20) rugRisk += 20;
  if ((contract?.warnings ?? []).length > 0) rugRisk += 25 * Math.min(contract!.warnings.length, 2);
  riskPoints += clamp(rugRisk, 0, 100) * RISK_WEIGHTS.rugIndicators;

  // Volatility (absolute 7d change as proxy)
  const vol7d = Math.abs(token.priceChange7d ?? 0);
  const volatilityRisk = clamp(vol7d * 1.5, 0, 100);
  riskPoints += volatilityRisk * RISK_WEIGHTS.volatility;

  // Age risk (newer = riskier)
  const age = token.age ?? 0;
  const ageRisk = age < 1 ? 100 : age < 7 ? 80 : age < 30 ? 50 : age < 90 ? 25 : 10;
  riskPoints += ageRisk * RISK_WEIGHTS.ageRisk;

  return clamp(riskPoints, 0, 100);
}

function calcOpportunityScore(token: Partial<Token>, momentum: number, liquidity: number, sentiment: number): number {
  const volAccel = clamp((token.volumeChange24h ?? 0) / 2 + 50, 0, 100);
  const narrativeHeat = token.socialMetrics?.narrativeHeat ?? 50;

  const raw =
    momentum * OPPORTUNITY_WEIGHTS.momentum +
    liquidity * OPPORTUNITY_WEIGHTS.liquidityScore +
    sentiment * OPPORTUNITY_WEIGHTS.socialTraction +
    volAccel * OPPORTUNITY_WEIGHTS.volumeAcceleration +
    narrativeHeat * OPPORTUNITY_WEIGHTS.narrativeHeat;

  // Apply risk penalty (high risk tokens get opportunity discount)
  const risk = calcRiskScore(token);
  const riskPenalty = risk > 70 ? (risk - 70) * 0.3 : 0;

  return clamp(raw - riskPenalty, 0, 100);
}

// ------------------------------------------------------------
// Main scoring function
// ------------------------------------------------------------

export function computeScores(token: Partial<Token>): TokenScores {
  const momentum = calcMomentumScore(token);
  const sentiment = calcSentimentScore(token);
  const liquidity = calcLiquidityScore(token);
  const risk = calcRiskScore(token);
  const opportunity = calcOpportunityScore(token, momentum, liquidity, sentiment);

  return {
    opportunity: Math.round(opportunity),
    risk: Math.round(risk),
    momentum: Math.round(momentum),
    sentiment: Math.round(sentiment),
    liquidity: Math.round(liquidity),
  };
}

// ------------------------------------------------------------
// Score history (generates a sparkline-style array)
// ------------------------------------------------------------

export function generateScoreHistory(
  currentScore: number,
  points = 24,
  volatility = 5
): number[] {
  const history: number[] = [];
  let score = currentScore - (Math.random() * 20 - 5);

  for (let i = 0; i < points; i++) {
    const delta = (Math.random() - 0.5) * volatility;
    score = clamp(score + delta, 10, 98);
    history.push(Math.round(score));
  }

  history.push(currentScore);
  return history;
}

export const SCORING_WEIGHTS = {
  opportunity: OPPORTUNITY_WEIGHTS,
  risk: RISK_WEIGHTS,
  momentum: MOMENTUM_WEIGHTS,
  sentiment: SENTIMENT_WEIGHTS,
  liquidity: LIQUIDITY_WEIGHTS,
} as const;

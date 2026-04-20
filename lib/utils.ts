import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format large numbers: 1234567 → "1.23M"
export function formatNumber(
  n: number,
  opts: { prefix?: string; suffix?: string; decimals?: number } = {}
): string {
  const { prefix = "", suffix = "", decimals = 2 } = opts;
  const abs = Math.abs(n);

  let formatted: string;
  if (abs >= 1e9) {
    formatted = `${(n / 1e9).toFixed(decimals)}B`;
  } else if (abs >= 1e6) {
    formatted = `${(n / 1e6).toFixed(decimals)}M`;
  } else if (abs >= 1e3) {
    formatted = `${(n / 1e3).toFixed(decimals)}K`;
  } else {
    formatted = n.toFixed(decimals);
  }

  return `${prefix}${formatted}${suffix}`;
}

// Format USD values
export function formatUSD(n: number, compact = false): string {
  if (compact) return formatNumber(n, { prefix: "$", decimals: 2 });
  if (n < 0.01) return `$${n.toFixed(8)}`;
  if (n < 1) return `$${n.toFixed(4)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

// Format price with appropriate precision
export function formatPrice(price: number): string {
  if (price < 0.000001) return `$${price.toExponential(2)}`;
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return formatUSD(price);
}

// Format percentage with sign
export function formatPct(n: number, decimals = 2): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(decimals)}%`;
}

// Score to color class
export function scoreToColor(score: number, invert = false): string {
  const s = invert ? 100 - score : score;
  if (s >= 80) return "text-green-primary";
  if (s >= 60) return "text-green-glow";
  if (s >= 40) return "text-yellow-400";
  if (s >= 20) return "text-orange-400";
  return "text-danger";
}

export function riskToColor(risk: number): string {
  if (risk <= 20) return "text-green-primary";
  if (risk <= 40) return "text-green-glow";
  if (risk <= 60) return "text-yellow-400";
  if (risk <= 80) return "text-orange-400";
  return "text-danger";
}

export function scoreToLabel(score: number): string {
  if (score >= 85) return "ELITE";
  if (score >= 70) return "STRONG";
  if (score >= 55) return "DECENT";
  if (score >= 40) return "WEAK";
  if (score >= 25) return "POOR";
  return "TRASH";
}

export function riskToLabel(risk: number): string {
  if (risk <= 20) return "LOW";
  if (risk <= 40) return "MODERATE";
  if (risk <= 60) return "HIGH";
  if (risk <= 80) return "VERY HIGH";
  return "EXTREME";
}

export function verdictToColor(verdict: string): string {
  const map: Record<string, string> = {
    "buy-signal": "text-green-primary",
    "watch": "text-info",
    "degen-play": "text-yellow-400",
    "high-risk": "text-orange-400",
    "avoid": "text-danger",
  };
  return map[verdict] ?? "text-gray-400";
}

export function verdictToLabel(verdict: string): string {
  const map: Record<string, string> = {
    "buy-signal": "BUY SIGNAL",
    "watch": "WATCH",
    "degen-play": "DEGEN PLAY",
    "high-risk": "HIGH RISK",
    "avoid": "AVOID",
  };
  return map[verdict] ?? verdict.toUpperCase();
}

// Chain badge color
export function chainToColor(chain: string): string {
  const map: Record<string, string> = {
    SOL: "text-purple-400",
    ETH: "text-blue-400",
    BSC: "text-yellow-400",
    BASE: "text-blue-300",
    AVAX: "text-red-400",
  };
  return map[chain] ?? "text-gray-400";
}

// Time since
export function timeSince(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Age formatting
export function formatAge(days: number): string {
  if (days < 1) return `${Math.floor(days * 24)}h`;
  if (days < 30) return `${Math.floor(days)}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}

// Truncate address
export function shortAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Clamp a number
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Random seeded number (for consistent demo data)
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate price history
export function generatePriceHistory(
  basePrice: number,
  points: number,
  volatility = 0.05,
  trend = 0
): Array<{ time: string; value: number }> {
  const history: Array<{ time: string; value: number }> = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = points; i >= 0; i--) {
    const change = (Math.random() - 0.5) * 2 * volatility + trend / points;
    price = price * (1 + change);
    history.push({
      time: new Date(now - i * 60 * 60 * 1000).toISOString(),
      value: Math.max(0, price),
    });
  }

  return history;
}

// Buy/sell pressure ratio label
export function bsRatioLabel(buys: number, sells: number): string {
  const ratio = buys / (sells || 1);
  if (ratio > 2) return "HEAVY BUY";
  if (ratio > 1.4) return "BUY PRESSURE";
  if (ratio > 0.8) return "BALANCED";
  if (ratio > 0.5) return "SELL PRESSURE";
  return "HEAVY SELL";
}

export function bsRatioColor(buys: number, sells: number): string {
  const ratio = buys / (sells || 1);
  if (ratio > 2) return "text-green-primary";
  if (ratio > 1.4) return "text-green-glow";
  if (ratio > 0.8) return "text-yellow-400";
  if (ratio > 0.5) return "text-orange-400";
  return "text-danger";
}

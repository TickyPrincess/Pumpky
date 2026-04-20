"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Trash2, Plus } from "lucide-react";
import { DEMO_TOKENS } from "@/lib/data/demo-tokens";
import {
  evaluateAlert,
  useWatchlistStore,
  type AlertDirection,
  type AlertMetric,
  type WatchlistEntry,
} from "@/store/watchlist";
import { formatPct, formatPrice, cn } from "@/lib/utils";
import { TerminalPanel } from "@/components/terminal/terminal-panel";

export function WatchlistBoard() {
  const itemsMap = useWatchlistStore((state) => state.items);
  const add = useWatchlistStore((state) => state.add);

  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const armedAlerts = items.filter((item) => item.alert?.enabled).length;

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white/85 tracking-tight">Watchlist</h1>
          <p className="terminal-text text-[11px] text-[#444] mt-1">
            Save coins, annotate setups, and run simulated score alerts.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded border border-white/[0.07] px-3 py-1.5">
          <Bell size={13} className="text-green-primary/80" />
          <span className="terminal-text text-[10px] text-[#666] uppercase tracking-wider">
            {armedAlerts} armed alerts
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <TerminalPanel title="Watchlist empty" subtitle="add tokens to begin" status="demo">
          <p className="text-sm text-[#777] mb-4">
            Your watchlist is empty. Add tokens from dashboard or use quick picks below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {DEMO_TOKENS.slice(0, 6).map((token) => (
              <button
                key={token.id}
                onClick={() => add(token)}
                className="flex items-center justify-between rounded border border-white/[0.07] bg-[#0b0b0b] px-3 py-2 hover:border-green-primary/25 transition-colors"
              >
                <span className="terminal-text text-xs text-white/75">{token.symbol}</span>
                <Plus size={13} className="text-green-primary" />
              </button>
            ))}
          </div>
        </TerminalPanel>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((item) => (
            <WatchlistCard key={item.token.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function WatchlistCard({ item }: { item: WatchlistEntry }) {
  const updateNotes = useWatchlistStore((state) => state.updateNotes);
  const updateTags = useWatchlistStore((state) => state.updateTags);
  const remove = useWatchlistStore((state) => state.remove);
  const setAlert = useWatchlistStore((state) => state.setAlert);

  const [notes, setNotes] = useState(item.notes);
  const [tagsInput, setTagsInput] = useState(item.tags.join(", "));

  const defaultMetric = item.alert?.metric ?? "opportunity";
  const defaultDirection = item.alert?.direction ?? "above";
  const defaultThreshold = String(item.alert?.threshold ?? (defaultMetric === "risk" ? 70 : 80));

  const [metric, setMetric] = useState<AlertMetric>(defaultMetric);
  const [direction, setDirection] = useState<AlertDirection>(defaultDirection);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [enabled, setEnabled] = useState(item.alert?.enabled ?? true);

  const currentScore = item.token.scores.opportunity;
  const delta = currentScore - item.scoreAtAdd;
  const triggered = evaluateAlert(item.token, item.alert);

  return (
    <TerminalPanel title={item.token.symbol} subtitle={item.token.name} status="demo">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/tokens/${item.token.id}`}
            className="terminal-text text-xs text-green-primary hover:underline"
          >
            Open token
          </Link>
          <span className="terminal-text text-[10px] text-[#666]">
            Price {formatPrice(item.token.price)}
          </span>
          <span
            className={cn(
              "terminal-text text-[10px]",
              item.token.priceChange24h >= 0 ? "text-green-primary" : "text-danger"
            )}
          >
            {formatPct(item.token.priceChange24h)}
          </span>

          <span
            className={cn(
              "terminal-text text-[10px] rounded border px-1.5 py-0.5",
              triggered
                ? "border-warning/40 text-warning"
                : "border-white/[0.1] text-[#666]"
            )}
          >
            {triggered ? "TRIGGERED" : item.alert?.enabled ? "ARMED" : "IDLE"}
          </span>

          <button
            onClick={() => remove(item.token.id)}
            className="ml-auto inline-flex items-center gap-1 rounded border border-danger/20 px-2 py-1 terminal-text text-[10px] text-danger/80 hover:border-danger/40"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Opportunity" value={`${currentScore}`} />
          <Stat label="Score delta" value={`${delta >= 0 ? "+" : ""}${delta}`} positive={delta >= 0} />
          <Stat label="Risk" value={`${item.token.scores.risk}`} positive={item.token.scores.risk < 60} />
          <Stat label="Momentum" value={`${item.token.scores.momentum}`} positive={item.token.scores.momentum >= 60} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => updateNotes(item.token.id, notes.trim())}
              rows={3}
              placeholder="Entry plan, invalidation, catalyst..."
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 text-xs text-white/70 outline-none focus:border-green-primary/30"
            />
          </label>

          <div className="space-y-2">
            <label className="space-y-1 block">
              <span className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">Tags (comma separated)</span>
              <input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                onBlur={() => {
                  const nextTags = tagsInput
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
                  updateTags(item.token.id, nextTags);
                }}
                placeholder="breakout, low-float"
                className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70 outline-none focus:border-green-primary/30"
              />
            </label>

            <div className="grid grid-cols-4 gap-2">
              <select
                value={metric}
                onChange={(event) => setMetric(event.target.value as AlertMetric)}
                className="col-span-2 rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70"
              >
                <option value="opportunity">Opportunity</option>
                <option value="risk">Risk</option>
                <option value="priceChange24h">24h Change</option>
              </select>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value as AlertDirection)}
                className="rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <input
                type="number"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                className="rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 terminal-text text-[10px] text-[#666]">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.target.checked)}
                />
                Enabled
              </label>

              <button
                onClick={() => {
                  const parsed = Number(threshold);
                  if (!Number.isFinite(parsed)) return;
                  setAlert(item.token.id, {
                    metric,
                    direction,
                    threshold: parsed,
                    enabled,
                  });
                }}
                className="ml-auto rounded border border-green-primary/25 px-2.5 py-1 terminal-text text-[10px] text-green-primary"
              >
                Save alert
              </button>

              <button
                onClick={() => setAlert(item.token.id, null)}
                className="rounded border border-white/[0.1] px-2.5 py-1 terminal-text text-[10px] text-[#666]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </TerminalPanel>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded border border-white/[0.07] bg-[#0d0d0d] px-2.5 py-2">
      <div className="terminal-text text-[9px] text-[#444] tracking-widest uppercase">{label}</div>
      <div
        className={cn(
          "terminal-text text-xs mt-0.5",
          positive === true
            ? "text-green-primary"
            : positive === false
            ? "text-danger"
            : "text-white/75"
        )}
      >
        {value}
      </div>
    </div>
  );
}

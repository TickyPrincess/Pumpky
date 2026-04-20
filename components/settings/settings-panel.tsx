"use client";

import { usePreferencesStore } from "@/store/preferences";
import { TerminalPanel } from "@/components/terminal/terminal-panel";

export function SettingsPanel() {
  const compactTables = usePreferencesStore((state) => state.compactTables);
  const showScanlines = usePreferencesStore((state) => state.showScanlines);
  const riskTolerance = usePreferencesStore((state) => state.riskTolerance);
  const autoRefreshSec = usePreferencesStore((state) => state.autoRefreshSec);

  const setCompactTables = usePreferencesStore((state) => state.setCompactTables);
  const setShowScanlines = usePreferencesStore((state) => state.setShowScanlines);
  const setRiskTolerance = usePreferencesStore((state) => state.setRiskTolerance);
  const setAutoRefreshSec = usePreferencesStore((state) => state.setAutoRefreshSec);

  return (
    <div className="flex flex-col flex-1 p-4 sm:p-6 gap-5">
      <div>
        <h1 className="text-xl font-semibold text-white/85 tracking-tight">Settings</h1>
        <p className="terminal-text text-[11px] text-[#444] mt-1">
          Local terminal preferences. Stored in browser local storage.
        </p>
      </div>

      <TerminalPanel title="Display" status="demo">
        <div className="space-y-3">
          <Toggle
            label="Compact tables"
            description="Reduce row height on leaderboard and watchlist."
            checked={compactTables}
            onChange={setCompactTables}
          />
          <Toggle
            label="Scanline overlay"
            description="Adds subtle CRT scanline effect to panels."
            checked={showScanlines}
            onChange={setShowScanlines}
          />
        </div>
      </TerminalPanel>

      <TerminalPanel title="Trading profile" status="demo">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">Risk tolerance</span>
            <select
              value={riskTolerance}
              onChange={(event) =>
                setRiskTolerance(event.target.value as "conservative" | "balanced" | "aggressive")
              }
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="terminal-text text-[10px] text-[#555] tracking-widest uppercase">Auto-refresh (seconds)</span>
            <input
              type="number"
              min={5}
              max={300}
              step={5}
              value={autoRefreshSec}
              onChange={(event) => setAutoRefreshSec(Math.max(5, Number(event.target.value) || 5))}
              className="w-full rounded border border-white/[0.1] bg-[#0d0d0d] px-2 py-1.5 terminal-text text-xs text-white/70"
            />
          </label>
        </div>
      </TerminalPanel>

      <TerminalPanel title="Data source" status="demo">
        <p className="text-sm text-[#777] leading-relaxed">
          Pumpky is currently running in demo mode. Switch <code>USE_LIVE_DATA=true</code> and wire the live provider adapters to activate production data feeds.
        </p>
      </TerminalPanel>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded border border-white/[0.05] bg-[#0d0d0d] p-3">
      <div>
        <div className="terminal-text text-xs text-white/80">{label}</div>
        <div className="text-[12px] text-[#666] mt-0.5">{description}</div>
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

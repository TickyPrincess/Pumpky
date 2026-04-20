"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreferencesState {
  compactTables: boolean;
  showScanlines: boolean;
  riskTolerance: "conservative" | "balanced" | "aggressive";
  autoRefreshSec: number;
  setCompactTables: (value: boolean) => void;
  setShowScanlines: (value: boolean) => void;
  setRiskTolerance: (value: PreferencesState["riskTolerance"]) => void;
  setAutoRefreshSec: (value: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      compactTables: false,
      showScanlines: true,
      riskTolerance: "balanced",
      autoRefreshSec: 30,
      setCompactTables: (value) => set({ compactTables: value }),
      setShowScanlines: (value) => set({ showScanlines: value }),
      setRiskTolerance: (value) => set({ riskTolerance: value }),
      setAutoRefreshSec: (value) => set({ autoRefreshSec: value }),
    }),
    {
      name: "pumpky-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

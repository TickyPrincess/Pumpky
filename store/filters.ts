"use client";

import { create } from "zustand";
import type { TokenFilters } from "@/lib/types";

const DEFAULT_FILTERS: TokenFilters = {
  chain: "all",
  minOpportunity: 0,
  maxRisk: 100,
  minMarketCap: 0,
  maxMarketCap: Infinity,
  minVolume: 0,
  tags: [],
  sortBy: "opportunity",
  sortDir: "desc",
  search: "",
};

interface FiltersStore {
  filters: TokenFilters;
  setFilter: <K extends keyof TokenFilters>(key: K, value: TokenFilters[K]) => void;
  setFilters: (partial: Partial<TokenFilters>) => void;
  reset: () => void;
  activeFilterCount: () => number;
}

export const useFiltersStore = create<FiltersStore>()((set, get) => ({
  filters: DEFAULT_FILTERS,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  setFilters: (partial) => {
    set((state) => ({
      filters: { ...state.filters, ...partial },
    }));
  },

  reset: () => set({ filters: DEFAULT_FILTERS }),

  activeFilterCount: () => {
    const f = get().filters;
    let count = 0;
    if (f.chain !== "all") count++;
    if (f.minOpportunity > 0) count++;
    if (f.maxRisk < 100) count++;
    if (f.minMarketCap > 0) count++;
    if (f.maxMarketCap < Infinity) count++;
    if (f.minVolume > 0) count++;
    if (f.tags.length > 0) count++;
    if (f.search) count++;
    return count;
  },
}));

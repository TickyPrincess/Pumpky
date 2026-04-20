"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Token } from "@/lib/types";

export type AlertMetric = "opportunity" | "risk" | "priceChange24h";
export type AlertDirection = "above" | "below";

export interface WatchlistAlert {
  metric: AlertMetric;
  direction: AlertDirection;
  threshold: number;
  enabled: boolean;
  createdAt: string;
}

export interface WatchlistEntry {
  token: Token;
  notes: string;
  tags: string[];
  addedAt: string;
  scoreAtAdd: number;
  alert: WatchlistAlert | null;
}

interface WatchlistStore {
  items: Record<string, WatchlistEntry>;
  add: (token: Token, notes?: string, tags?: string[]) => void;
  remove: (tokenId: string) => void;
  updateNotes: (tokenId: string, notes: string) => void;
  updateTags: (tokenId: string, tags: string[]) => void;
  setAlert: (tokenId: string, alert: Omit<WatchlistAlert, "createdAt"> | null) => void;
  has: (tokenId: string) => boolean;
  getAll: () => WatchlistEntry[];
}

export function evaluateAlert(token: Token, alert: WatchlistAlert | null): boolean {
  if (!alert || !alert.enabled) return false;

  const value =
    alert.metric === "opportunity"
      ? token.scores.opportunity
      : alert.metric === "risk"
      ? token.scores.risk
      : token.priceChange24h;

  return alert.direction === "above"
    ? value >= alert.threshold
    : value <= alert.threshold;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: {},

      add: (token, notes = "", tags = []) => {
        set((state) => ({
          items: {
            ...state.items,
            [token.id]: {
              token,
              notes,
              tags,
              addedAt: new Date().toISOString(),
              scoreAtAdd: token.scores.opportunity,
              alert: state.items[token.id]?.alert ?? null,
            },
          },
        }));
      },

      remove: (tokenId) => {
        set((state) => {
          const next = { ...state.items };
          delete next[tokenId];
          return { items: next };
        });
      },

      updateNotes: (tokenId, notes) => {
        set((state) => {
          if (!state.items[tokenId]) return state;
          return {
            items: {
              ...state.items,
              [tokenId]: { ...state.items[tokenId], notes },
            },
          };
        });
      },

      updateTags: (tokenId, tags) => {
        set((state) => {
          if (!state.items[tokenId]) return state;
          return {
            items: {
              ...state.items,
              [tokenId]: { ...state.items[tokenId], tags },
            },
          };
        });
      },

      setAlert: (tokenId, alert) => {
        set((state) => {
          if (!state.items[tokenId]) return state;
          return {
            items: {
              ...state.items,
              [tokenId]: {
                ...state.items[tokenId],
                alert: alert
                  ? {
                      ...alert,
                      createdAt: new Date().toISOString(),
                    }
                  : null,
              },
            },
          };
        });
      },

      has: (tokenId) => !!get().items[tokenId],

      getAll: () => Object.values(get().items),
    }),
    {
      name: "pumpky-watchlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

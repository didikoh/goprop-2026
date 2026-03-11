import { create } from "zustand";

type LoadingState = {
  loading: number;
  setLoading: (value: number | ((prev: number) => number)) => void;
  resetLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: 0,
  setLoading: (value) =>
    set((state) => ({
      loading: typeof value === "function" ? value(state.loading) : value,
    })),
  resetLoading: () => set({ loading: 0 }),
}));

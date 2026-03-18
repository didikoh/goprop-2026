import { create } from "zustand";

type DistanceState = {
  distance: string;
  setDistance: (distance: string) => void;
};

export const useDistanceStore = create<DistanceState>((set) => ({
  distance: "kl",
  setDistance: (distance) => set({ distance }),
}));

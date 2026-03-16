import { create } from "zustand";

type LocationState = {
  location: string;
  setLocation: (location: string) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  location: "kl",
  setLocation: (location) => set({ location }),
}));

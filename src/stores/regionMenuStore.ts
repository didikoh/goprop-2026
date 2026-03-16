import { create } from "zustand";

type RegionMenuState = {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
};

export const useRegionMenuStore = create<RegionMenuState>((set) => ({
  selectedMenu: "kl",
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));

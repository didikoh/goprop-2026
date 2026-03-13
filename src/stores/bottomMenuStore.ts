import { create } from "zustand";

type BottomMenuState = {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
};

export const useBottomMenuStore = create<BottomMenuState>((set) => ({
  selectedMenu: "home",
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));
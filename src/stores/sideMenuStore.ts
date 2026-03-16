import { create } from "zustand";

type SideMenuState = {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
};

export const useSideMenuStore = create<SideMenuState>((set) => ({
  selectedMenu: "region",
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));

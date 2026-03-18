import { create } from "zustand";

type SubMenuState = {
  subMenu: string;
  setSubMenu: (menu: string) => void;
};

export const useSubMenuStore = create<SubMenuState>((set) => ({
  subMenu: "home",
  setSubMenu: (menu) => set({ subMenu: menu }),
})); // "home" | "projects" | "chat" | "amenities" | "whatsapp"
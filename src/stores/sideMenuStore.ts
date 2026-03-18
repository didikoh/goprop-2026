import { create } from "zustand";

type SideMenuState = {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
};

export const useSideMenuStore = create<SideMenuState>((set) => ({
  selectedMenu: "region",
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
})); // "region" | "project" | "projectInfo" | "landmarkInfo"

type SideMenuMinimizeState = {
  isSideMenuMinimized: boolean;
  setIsSideMenuMinimized: (isSideMenuMinimized: boolean) => void;
};

export const useSideMenuMinimizeStore = create<SideMenuMinimizeState>((set) => ({
  isSideMenuMinimized: false,
  setIsSideMenuMinimized: (isSideMenuMinimized) => set({ isSideMenuMinimized }),
}));


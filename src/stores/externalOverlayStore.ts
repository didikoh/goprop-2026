import { create } from "zustand";

type ExtOverlayState = {
  isExternalOverlay: boolean;
  setIsExternalOverlay: (isExternalOverlay: boolean) => void;
};

export const useExtOverlayStore = create<ExtOverlayState>((set) => ({
  isExternalOverlay: false,
  setIsExternalOverlay: (isExternalOverlay) => set({ isExternalOverlay }),
})); 

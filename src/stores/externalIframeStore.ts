import { create } from "zustand";

type ExtIframeState = {
  externalIframeUrl: string;
  setExternalIframeUrl: (externalIframeUrl: string) => void;
};

export const useExtIframeStore = create<ExtIframeState>((set) => ({
  externalIframeUrl: "",
  setExternalIframeUrl: (externalIframeUrl) => set({ externalIframeUrl }),
})); 

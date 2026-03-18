import { create } from "zustand";

type MapTypeState = {
  mapType: string;
  setMapType: (mapType: string) => void;
};

export const useMapStore = create<MapTypeState>((set) => ({
  mapType: "3d",
  setMapType: (mapType) => set({ mapType }),
}));

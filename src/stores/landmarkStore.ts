import { create } from "zustand";
import type { LandmarkModel } from "../api/landmarks/LandmarkModel";

type LandmarkArrState = {
  landmarks: LandmarkModel[];
  setLandmarks: (landmarks: LandmarkModel[]) => void;
};

export const useLandmarkArrStore = create<LandmarkArrState>((set) => ({
  landmarks: [],
  setLandmarks: (landmarks) => set({ landmarks: landmarks }),
}));

type LandmarkState = {
  selectedLandmark: LandmarkModel | null;
  setSelectedLandmark: (landmark: LandmarkModel | null) => void;
};

export const useLandmarkStore = create<LandmarkState>((set) => ({
  selectedLandmark: null,
  setSelectedLandmark: (landmark) => set({ selectedLandmark: landmark }),
}));

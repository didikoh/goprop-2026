import { create } from "zustand";

type AmenityState = {
  amenities: string;
  setAmenities: (amenities: string) => void;
};

export const useAmenityStore = create<AmenityState>((set) => ({
  amenities: "",
  setAmenities: (amenities) => set({ amenities }),
}));

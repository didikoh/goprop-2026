import { create } from "zustand";

type UIPhotoState = {
  isPhotoUI: boolean;
  setIsPhotoUI: (isPhotoUI: boolean) => void;
};

export const useUIPhotoStore = create<UIPhotoState>((set) => ({
  isPhotoUI: false,
  setIsPhotoUI: (isPhotoUI) => set({ isPhotoUI: isPhotoUI }),
}));

type PhotoArrState = {
  photos: string[];
  setPhotos: (photos: string[]) => void;
}

export const usePhotosStore = create<PhotoArrState>((set) => ({
  photos: [],
  setPhotos: (photos) => set({ photos: photos }),
}));

type PhotoIndState = {
  photoUIIndex: number;
  setPhotoUIIndex: (photoUIIndex: number) => void;
}

export const usePhotoUIIndStore = create<PhotoIndState>((set) => ({
  photoUIIndex: 0,
  setPhotoUIIndex: (photoUIIndex) => set({ photoUIIndex }),
}));

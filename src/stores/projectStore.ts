import { create } from "zustand";
import type { ProjectModel } from "../api/projects/ProjectModel";

type ProjectState = {
  project: ProjectModel | null;
  setProject: (project: ProjectModel | null) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project: project }),
}));

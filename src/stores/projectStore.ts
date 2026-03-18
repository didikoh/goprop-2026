import { create } from "zustand";
import type { ProjectModel } from "../api/projects/ProjectModel";

type PurchaseState = {
  purchaseMode: number;
  setPurchaseMode: (purchaseMode: number) => void;
};

export const usePurchaseStore = create<PurchaseState>((set) => ({
  purchaseMode: 0,
  setPurchaseMode: (purchaseMode) => set({ purchaseMode }),
}));

type ProjectState = {
  project: ProjectModel | null;
  setProject: (project: ProjectModel | null) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project: project }),
}));

type ProjectsArrState = {
  projects: ProjectModel[];
  setProjects: (projects: ProjectModel[]) => void;
};

export const useProjectsArrStore = create<ProjectsArrState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));

export class ProjectDataInt {
  p_details?: number;
  p_distance?: number;
  p_chatbot?: number;
  p_compare?: number;
  p_share?: number;
  p_location?: number;
  p_virtual_tour?: number;
  p_floor_plan?: number;
  p_video?: number;
  p_external?: number;
  p_submit_expl?: number;
}

type ProjectDataIntState = {
  projectData: any;
  setProjectData: (projectData: any) => void;
};

export const useProjectDataStore = create<ProjectDataIntState>((set) => ({
  projectData: {
    p_details: 1,
    p_distance: 0,
    p_chatbot: 0,
    p_compare: 0,
    p_share: 0,
    p_location: 0,
    p_virtual_tour: 0,
    p_floor_plan: 0,
    p_video: 0,
    p_external: 0,
    p_submit_expl: 0,
  },
  setProjectData: (projectData) => set({ projectData }),
}));



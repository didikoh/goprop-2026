import { useEffect, useRef } from "react";
import "./App.css";
import "./components/topMenuWidgets/styles/TopMenu.css";
import MainLoading from "./pages/MainLoading";
import MainScene from "./scenes/MainScene";
import { FullBottomWidget } from "./components/fullBottomWidgets/FullBottomWidget";
import { ProjectAPI } from "./api/projects/ProjectsAPI";
import { useProjectsArrStore } from "./stores/projectStore";
import InteractSelect from "./components/interactiveSelections/InteractSelect";
import { LandmarkAPI } from "./api/projects/LandmarkAPI";
import { useLandmarkArrStore, useLandmarkStore } from "./stores/landmarkStore";
import "./components/sideMenuWidgets/styles/SideMenu.css";
import TopMenu from "./components/topMenuWidgets/TopMenu";

function App() {
  const sceneRef = useRef<any>(null);
  const { projects, setProjects } = useProjectsArrStore();
  const { landmarks, setLandmarks } = useLandmarkArrStore();
  const { selectedLandmark, setSelectedLandmark } = useLandmarkStore();
  const focusTargetRef = useRef<((targetMeshName: string) => void) | null>(null);

  const projectApi = new ProjectAPI();
  const landmarkApi = new LandmarkAPI();
  const location = 'all';
  const lm_location = 'kl';

  useEffect(() => {
    setTimeout(() => {
      projectApi.fetchProjects(setProjects, location);
      landmarkApi.fetchLandmarks(setLandmarks, lm_location, setSelectedLandmark);
    }, 0);

    sceneRef.current?.setUniProjectList(projects);
  }, []);

  return (
    <>
      <MainLoading />
      <MainScene projectsList={projects} ref={sceneRef} />
      <InteractSelect />
      <TopMenu />
      <FullBottomWidget />
    </>
  );
}

export default App;

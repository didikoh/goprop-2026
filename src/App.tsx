import { useEffect, useRef } from "react";
import "./App.css";
import MainLoading from "./pages/MainLoading";
import MainScene from "./scenes/MainScene";
import { FullBottomWidget } from "./components/fullBottomWidgets/FullBottomWidget";
import { ProjectAPI } from "./api/projects/ProjectsAPI";
import { useProjectsArrStore } from "./stores/projectStore";
import InteractSelect from "./components/interactiveSelections/InteractSelect";

function App() {
  const sceneRef = useRef<any>(null);
  const { projects, setProjects } = useProjectsArrStore();
  const focusTargetRef = useRef<((targetMeshName: string) => void) | null>(null);

  const projectApi = new ProjectAPI();
  const location = 'all';

  useEffect(() => {
    setTimeout(() => {
      projectApi.fetchProjects(setProjects, location);
    }, 0);

    sceneRef.current?.setUniProjectList(projects);
  }, []);

  return (
    <>
      <MainLoading />
      <MainScene projectsList={projects} ref={sceneRef} />
      <InteractSelect />
      <FullBottomWidget />
    </>
  );
}

export default App;

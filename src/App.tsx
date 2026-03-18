import { useEffect, useRef, useState } from "react";
import "./App.css";
import MainLoading from "./pages/MainLoading";
import MainScene from "./scenes/MainScene";
import { FullBottomWidget } from "./components/fullBottomWidgets/FullBottomWidget";
import { ProjectAPI } from "./api/projects/ProjectsAPI";
import type { ProjectModel } from "./api/projects/ProjectModel";
import { useProjectsArrStore } from "./stores/projectStore";

function App() {
  const sceneRef = useRef<any>(null);
  const [projectsList, setProjectsList] = useState<ProjectModel[]>([]);
  const { projects, setProjects } = useProjectsArrStore();
  //const [selectedProject, setSelectedProject] = useState<null | ProjectModel>(null);
  const focusTargetRef = useRef<((targetMeshName: string) => void) | null>(
    null
  );

  const projectApi = new ProjectAPI();
  const location = 'all';

  useEffect(() => {
    setTimeout(() => {
      projectApi.fetchProjects(setProjects, location);
    }, 0);

    sceneRef.current?.setUniProjectList(projectsList);
  }, []);

  return (
    <>
      <MainLoading />
      <MainScene projectsList={projectsList} ref={sceneRef} />
      <FullBottomWidget projectsList={projectsList} />
    </>
  );
}

export default App;

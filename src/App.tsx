import { useEffect, useRef, useState } from "react";
import "./App.css";
import BottomMenu from "./components/menuWidgets/BottomMenu";
import MainLoading from "./pages/MainLoading";
import MainScene from "./scenes/MainScene";
import { FullBottomWidget } from "./components/fullBottomWidgets/FullBottomWidget";
import RightWidget from "./components/geoclimateWidgets/RightWidget";
import { ProjectAPI } from "./api/projects/ProjectsAPI";
import type { ProjectModel } from "./api/projects/ProjectModel";

function App() {
  const sceneRef = useRef<any>(null);
  const [projectsList, setProjectsList] = useState<ProjectModel[]>([]);
  const [selectedProject, setSelectedProject] = useState<null | ProjectModel>(null);
  const focusTargetRef = useRef<((targetMeshName: string) => void) | null>(
    null
  );

  const projectApi = new ProjectAPI();
  const location = 'all';

  useEffect(() => {
    setTimeout(() => {
      projectApi.fetchProjects(setProjectsList, location);
    }, 0);

    sceneRef.current?.setUniProjectList(projectsList);
  }, []);

  return (
    <>
      <MainLoading />
      <MainScene projectsList={projectsList} ref={sceneRef} />
      <FullBottomWidget projectsList={projectsList} selectedProject={selectedProject} setSelectedProject={setSelectedProject}/>
    </>
  );
}

export default App;

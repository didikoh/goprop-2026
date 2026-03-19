//import { useAppContext } from "@context/AppContext";
import ProjectCard from "./ProjectCard";
//import SearchBar from "@components/SearchBar/SearchBar";
import { useState } from "react";
import "./styles/ProjectMenu.css";
import "./styles/ToggleMode.css";
import type { ProjectModel } from "../../api/projects/ProjectModel";
import { usePurchaseStore } from "../../stores/projectStore";
import SearchBar from "../searchBar/SearchBar";

interface ProjectListProp {
    uniProjectsList: ProjectModel[];
    filterProject: string;
}

function getFilteredProjects(filteredProjects: ProjectModel[], mode: string) {
    if (mode === 'buy') {
        return filteredProjects.filter((project: any) => (project.priceFromMin != null));
    } else if (mode === 'rent') {
        return filteredProjects.filter((project: any) => (project.rentPriceMin != null));
    } else {
        return filteredProjects;
    }
}

export function ProjButton({ mode, setMode, classMode }: any) {
  const { setPurchaseMode } = usePurchaseStore();

  return (
    <button 
      onClick={() => {
        setMode(mode);
        setPurchaseMode((mode === 'buy') ? 0 : ((mode === 'rent') ? 1 : 2));
      }}
      className={`button ${classMode}`}
    >
      {`${mode.charAt(0).toUpperCase()}${mode.slice(1)}`}
    </button>
  );
}

const ProjectMenu = ({ uniProjectsList, filterProject }: ProjectListProp) => {
  const [mode, setMode] = useState<string>('buy');

  const filteredProjects = uniProjectsList.filter((project: any) =>
    project.name?.toLowerCase().includes(filterProject.toLowerCase())
  );

  const projectCardProp = { purchaseMode: mode };

  return (
    <div className="project-menu">
      <SearchBar />
      <div className="toggle-container">
        <ProjButton mode='buy' setMode={setMode} classMode={(mode === 'buy') ? 'active' : ''} />
        <ProjButton mode='rent' setMode={setMode} classMode={(mode === 'rent') ? 'active' : ''} />
        <ProjButton mode='all' setMode={setMode} classMode={(mode === 'all') ? 'active' : ''}/>
      </div>
      <div className="project-menu__content">
        {getFilteredProjects(filteredProjects, mode).map((project: any) => (
          <ProjectCard key={project.id} project={project} {...projectCardProp}  />
        ))}
      </div>
    </div>
  );
};

export default ProjectMenu;


//import { useAppContext } from "@context/AppContext";
import ProjectCard from "./ProjectCard";
//import SearchBar from "@components/SearchBar/SearchBar";
import { useState } from "react";
import "./styles/ProjectMenu.css";
import "./styles/ToggleMode.css";
import type { ProjectModel } from "../../api/projects/ProjectModel";

interface ProjectListProp {
    uniProjectsList: ProjectModel[];
    filterProject: string;
}

export function ProjButton({ mode, setMode, classMode }: any) {
  return (
    <button 
      onClick={() => setMode((mode === 'buy') ? 'buy' : ((mode === 'rent') ? 'rent' : 'all'))}
      className={classMode}
    >
      {`${mode.charAt(0).toUpperCase()}${mode.slice(1)}`}
    </button>
  );
}

const ProjectMenu = ({ uniProjectsList, filterProject }: ProjectListProp) => {
  const [mode, setMode] = useState('buy');

  // Filter projects based on search term
  const filteredProjects = uniProjectsList.filter((project: any) =>
    project.name?.toLowerCase().includes(filterProject.toLowerCase())
  );

  const projectCardProp = { purchaseMode: mode };

  return (
    <div className="project-menu">
      {/* <SearchBar /> */}
      <div>
        <div className="toggle-container">
          <ProjButton mode='buy' setMode={setMode} classMode={(mode === 'buy') ? 'active' : ''} />
          <ProjButton mode='rent' setMode={setMode} classMode={(mode === 'rent') ? 'active' : ''} />
          <ProjButton mode='all' setMode={setMode} classMode={(mode === 'all') ? 'active' : ''}/>
        </div>
      </div>
      <div className="project-menu__content">
        {filteredProjects.map((project: any) => (
          <ProjectCard key={project.id} project={project} {...projectCardProp} />
        ))}
      </div>
    </div>
  );
};

export default ProjectMenu;


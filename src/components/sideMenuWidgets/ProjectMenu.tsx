//import { useAppContext } from "@context/AppContext";
import ProjectCard from "@components/ProjectCard/ProjectCard";
import SearchBar from "@components/SearchBar/SearchBar";
import { useState } from "react";
import "../../css/ToggleMode.css";
import type { ProjectModel } from "../../api/projects/ProjectModel";

interface ProjectListProp {
    projectsList: ProjectModel[];
}

const ProjectMenu = () => {
  //const { projects, location, filterProject } = useAppContext();
  const [mode, setMode] = useState('buy');

  // Filter projects based on search term
  const filteredProjects = projects.filter((project: any) =>
    project.name?.toLowerCase().includes(filterProject.toLowerCase())
  );

  return (
    <div className="project-menu">
      <SearchBar />
      <div>
        <div className="toggle-container">
          <button 
            onClick={() => setMode('buy')}
            className={(mode === 'buy') ? 'active' : ''}
          >
            Buy
          </button>
          <button 
            onClick={() => setMode('rent')}
            className={(mode === 'rent') ? 'active' : ''}
          >
            Rent
          </button>
          <button 
            onClick={() => setMode('all')}
            className={(mode === 'all') ? 'active' : ''}
          >
            All
          </button>
        </div>
      </div>
      <div className="project-menu__content">
        {filteredProjects.map((project: any) => (
          <ProjectCard key={project.id} project={project} location={location} purchaseMode={mode} />
        ))}
      </div>
    </div>
  );
};

export default ProjectMenu;


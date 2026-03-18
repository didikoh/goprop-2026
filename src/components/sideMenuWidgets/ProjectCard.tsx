import type { ProjectModel } from "../../api/projects/ProjectModel";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";
import { useLocationStore } from "../../stores/locationStore";
import { useProjectStore } from "../../stores/projectStore";
import { useSideMenuStore } from "../../stores/sideMenuStore";
import "./styles/ProjectCard.css";

interface ProjectCardProp {
    project: ProjectModel;
    //location: string;
    purchaseMode: string;
    //setBottomMenu: (menu: string) => void;
    //setSideMenu: (menu: string) => void;
    //setSelectedProject: (project: ProjectModel | null) => void;
}

export function SpecItemCard({ icon, label, minParam, maxParam, minUnit, maxUnit }: any) {
    return (
        <div className="project-card2__spec-item">
            <img src={`./assets/projectinfo/icons/${icon}.svg`} alt={`${label} Icon`} />
            <span>{(minParam === maxParam) ? maxParam : `${minParam}${minUnit} - ${maxParam}${maxUnit}`}</span>
        </div>
    );
}

const ProjectCard = ({ project }: ProjectCardProp) => {
  const photosUrl = import.meta.env.VITE_PHOTOS_URL;
  const { location: location } = useLocationStore();
  const { setSelectedMenu: setBottomMenu } = useBottomMenuStore();
  const { setSelectedMenu: setSideMenu } = useSideMenuStore();
  const { setProject: setSelectedProject } = useProjectStore();

  const getPhotos = () => {
    if (project.region != location) {
      return "";
    }
    const projectName = project.name;
    const url = `${photosUrl}/${location}/${projectName}/photos/`;
    const photos = `${url}${1}.webp`;
    return photos;
  };

  return (
    <div
      className="project-card2"
      onClick={() => {
        setSelectedProject(project);
        setBottomMenu("projects");
        setSideMenu("projectInfo");
        //focusTargetRef.current?.(project.name);
      }}
    >
      <div className="project-card2__image">
        <img src={getPhotos()} alt="Project Image" />
      </div>
      <div className="project-card2__text">
        <div className="project-card2__name">{project.name}</div>
        <div className="project-card2__price">{project.price}</div>
        <div className="project-card2__specs">
            <SpecItemCard icon="bed" label="Bedroom" minParam={project.bedroomMin} maxParam={project.bedroomMax} minUnit="" maxUnit="" />
            <SpecItemCard icon="bath" label="Bathroom" minParam={project.bathroomMin} maxParam={project.bathroomMax} minUnit="" maxUnit="" />
            <SpecItemCard icon="size" label="Size" minParam={project.sizeMin} maxParam={project.sizeMax} minUnit=" sqft" maxUnit=" sqft" />
        </div>
      </div>
      <div className="project-card2__btn" />
    </div>
  );
};

export default ProjectCard;

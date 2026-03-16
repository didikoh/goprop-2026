// import ProjectInfo from "./ProjectInfo";
// import LandMarkInfo from "./LandMarkInfo";
import { useEffect, useState } from "react";
import "./styles/SideMenu.css";
import RegionMenu from "./RegionMenu";
import CloseIcon from '@mui/icons-material/Close';
import { ProjectModel } from "../../api/projects/ProjectModel";
import ProjectMenu from "./ProjectMenu";
import { useSideMenuStore } from "../../stores/sideMenuStore";
import { useRegionMenuStore } from "../../stores/regionMenuStore";
import { useLocationStore } from "../../stores/locationStore";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";
import { useProjectStore } from "../../stores/projectStore";

export function SideMenuHeader() {
    const { selectedMenu: bottomMenu, setSelectedMenu: setBottomMenu } = useBottomMenuStore();
    const { selectedMenu: sideMenu, setSelectedMenu: setSideMenu } = useSideMenuStore();
    const { setProject: setSelectedProject } = useProjectStore();

    const getTitle = () => {
        switch (sideMenu) {
            case "region":
                return "All Projects";
            case "project":
                return "Project Menu";
            // case "projectInfo":
            //     return selectedProject?.name || "Project Name";
            // case "landmarkInfo":
            //     return selectedLandmark?.name || "Landmark Name";
            default:
                return "Menu";
        }
    };

    return (
        <div className="side-menu__header">
        {/* {sideMenu !== "region" && sideMenu !== "landmarkInfo" && (
            <div
            className="side-menu__back-button"
            onClick={() => {
                if (isPhotoUI) {
                setIsPhotoUI(false);
                } else {
                if (sideMenu === "projectInfo") {
                    setSelectedProject(null);
                }
                setSideMenu(sideMenu === "project" ? "region" : "project");
                }
            }}
            >
            <ChevronLeftIcon />
            </div>
        )} */}
            <h1 className="side-menu__title">{getTitle()}</h1>
            <button
                className="side-menu__close-button"
                onClick={() => {
                    setSelectedProject(null);
                    setBottomMenu("home");
                    setSideMenu("region");
                }}
            >
                <CloseIcon />
            </button>
        </div>
    );
}

interface SideMenuProp {
    projectsList: ProjectModel[];
    //sideMenu: string;
    // regionMenu: string;
    // setRegionMenu: (menu: string) => void;
    // location: string;
    // setLocation: (location: string) => void;
    // setBottomMenu: (menu: string) => void;
    //setSideMenu: (menu: string) => void;
    // selectedProject: ProjectModel | null; 
    // setSelectedProject: (project: ProjectModel | null) => void;
}

const SideMenu = ({ projectsList }: SideMenuProp) => {
  const [isSideMenuMinimized, setIsSideMenuMinimized] = useState<boolean>(false);
  const [uniProjectsList, setUniProjectsList] = useState<ProjectModel[]>([]);
  const { selectedMenu: sideMenu } = useSideMenuStore();
  const { selectedMenu: regionMenu } = useRegionMenuStore();
  const { location: location } = useLocationStore();

  useEffect(() => {
    console.log(`Location now = ${location}`);
    console.log(`Region now = ${regionMenu}`);
    setTimeout(() => {
        setUniProjectsList(projectsList.filter((project) => (project.region === location)));
    }, 0);
    
  }, [regionMenu, location, projectsList]);

  const projectProp = { uniProjectsList, filterProject: "" };

  return (
    <div className={`side-menu ${isSideMenuMinimized ? "side-menu--minimized" : ""}`}>
      <SideMenuHeader />
      {sideMenu === "region" && <RegionMenu />}
      {sideMenu === "project" && <ProjectMenu {...projectProp} />}
      {/* {sideMenu === "projectInfo" && <ProjectInfo purchaseMode={0} />}
      {sideMenu === "landmarkInfo" && <LandMarkInfo />} */}
    </div>
  );
};

export default SideMenu;

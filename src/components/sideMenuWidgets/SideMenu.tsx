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
import { useProjectsArrStore, useProjectStore, usePurchaseStore, useSearchProjectStore } from "../../stores/projectStore";
import ProjectInfo from "./ProjectInfo";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useUIPhotoStore } from "../../stores/uiPhotoStore";

export function SideMenuHeader() {
    const { setSelectedMenu: setBottomMenu } = useBottomMenuStore();
    const { selectedMenu: sideMenu, setSelectedMenu: setSideMenu } = useSideMenuStore();
    const { setProject: setSelectedProject } = useProjectStore();
    const { isPhotoUI, setIsPhotoUI } = useUIPhotoStore();

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
        {sideMenu !== "region" && sideMenu !== "landmarkInfo" && (
            <div
                className="side-menu__back-button"
                onClick={() => {
                    if (isPhotoUI) {
                        setIsPhotoUI(false);
                    } else {
                        if (sideMenu === "projectInfo") {
                            setSelectedProject(null);
                        }
                        setSideMenu((sideMenu === "project") ? "region" : "project");
                    }
                }}
            >
                <ChevronLeftIcon />
            </div>
        )}
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

const SideMenu = () => {
    const { projects } = useProjectsArrStore();
    const { purchaseMode } = usePurchaseStore();
  const [isSideMenuMinimized] = useState<boolean>(false);
  const [uniProjectsList, setUniProjectsList] = useState<ProjectModel[]>([]);
  const { selectedMenu: sideMenu } = useSideMenuStore();
  const { selectedMenu: regionMenu } = useRegionMenuStore();
  const { location: location } = useLocationStore();
  const { filterProject } = useSearchProjectStore();

  useEffect(() => {
    console.log(`Location now = ${location}`);
    console.log(`Region now = ${regionMenu}`);
    setTimeout(() => {
        setUniProjectsList(projects.filter((project) => (project.region === location)));
    }, 0);
    
  }, [regionMenu, location, projects]);

  const projectProp = { uniProjectsList, filterProject: filterProject };

  return (
    <div className={`side-menu ${isSideMenuMinimized ? "side-menu--minimized" : ""}`}>
      <SideMenuHeader />
      {sideMenu === "region" && <RegionMenu />}
      {sideMenu === "project" && <ProjectMenu {...projectProp} />}
      {sideMenu === "projectInfo" && <ProjectInfo purchaseMode={purchaseMode} />}
      {/* {sideMenu === "landmarkInfo" && <LandMarkInfo />} */}
    </div>
  );
};

export default SideMenu;

// import SideMenuHeader from "./SideMenuHeader";
// import ProjectMenu from "./ProjectMenu";
// import ProjectInfo from "./ProjectInfo";
// import LandMarkInfo from "./LandMarkInfo";
import { useState } from "react";
import "./styles/SideMenu.css";
import RegionMenu from "./RegionMenu";
import CloseIcon from '@mui/icons-material/Close';
import type { ProjectModel } from "../../api/projects/ProjectModel";

interface SideMenuHeadProp {
    sideMenu: string;
    closeBtn: () => void;
}

export function SideMenuHeader({ sideMenu, closeBtn }: SideMenuHeadProp) {

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
                onClick={closeBtn}
                // onClick={() => {
                //     // if (isPhotoUI) {
                //     //     setIsPhotoUI(false);
                //     //     handleSideMenu(null);
                //     // } else {
                //         //handleSideMenu(null);
                //     // }

                //     setSelectedProject(null);
                //     setBottomMenu("home");
                //     setSideMenu("region");
                // }}
            >
                <CloseIcon />
            </button>
        </div>
    );
}

interface SideMenuProp {
    projectsList: ProjectModel[];
    sideMenu: string;
    regionMenu: string;
    setRegionMenu: (menu: string) => void;
    closeBtn: () => void;
}

const SideMenu = ({ projectsList, sideMenu, regionMenu, setRegionMenu, closeBtn }: SideMenuProp) => {
  const [isSideMenuMinimized, setIsSideMenuMinimized] = useState<boolean>(false);



  return (
    <div className={`side-menu ${isSideMenuMinimized ? "side-menu--minimized" : ""}`}>
      <SideMenuHeader sideMenu={sideMenu} closeBtn={closeBtn} />
      {sideMenu === "region" && <RegionMenu location="" regionMenu={regionMenu} setRegionMenu={setRegionMenu} />}
      {/* {sideMenu === "project" && <ProjectMenu projectsList={projectsList} />} */}
      {/* {sideMenu === "projectInfo" && <ProjectInfo purchaseMode={0} />}
      {sideMenu === "landmarkInfo" && <LandMarkInfo />} */}
    </div>
  );
};

export default SideMenu;

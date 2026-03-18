import BottomMenu from "../menuWidgets/BottomMenu";
import RightWidget from "../geoclimateWidgets/RightWidget";
import SideMenu from "../sideMenuWidgets/SideMenu";
import AmenitiesMenu from "../amenitiesMenuWidgets/AmenitiesMenu";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";
import type { ProjectModel } from "../../api/projects/ProjectModel";

interface ProjectListProp {
    projectsList: ProjectModel[];
    // selectedProject: ProjectModel | null; 
    // setSelectedProject: (project: ProjectModel | null) => void;
}

export function FullBottomWidget({ projectsList }: ProjectListProp) {
    // const [location, setLocation] = useState<string>("kl");
    const { selectedMenu: bottomMenu } = useBottomMenuStore(); // "home" | "projects" | "chat" | "amenities" | "whatsapp"
    //const { selectedMenu: sideMenu, setSelectedMenu: setSideMenu } = useSideMenuStore(); // "region" | "project" | "projectInfo" | "landmarkInfo"
    // const [amenities, setAmenities] = useState<any>("");
    // const [subMenu, setSubMenu] = useState<string>("home");
    // const [mapType, setMapType] = useState("3d");

    const sideMenuProps = {
        projectsList,
        // sideMenu,
        // regionMenu,
        // setRegionMenu,
        // location,
        // setLocation,
        // setBottomMenu,
        // setSideMenu,
        // selectedProject,
        // setSelectedProject,
        // closeBtn: () => {
        //     setSelectedProject(null);
        //     setBottomMenu("home");
        //     setSideMenu("region");
        // }
    };

    /*const amenitiesProps = {
        //location,
        distance: -1,
        //subMenu,
        // amenities,
        // setAmenities
    };

    const rightWidgetProps = {
        //mapType,
        location,
        //setMapType
    };*/

    
    return (
        <div className="widget">
            {(bottomMenu === "projects") && <SideMenu {...sideMenuProps} />}
            {(bottomMenu === "amenities") && <AmenitiesMenu />}
            <RightWidget />
            <BottomMenu />
        </div>
    );
}
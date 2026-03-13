import { useRef, useState } from "react";
import BottomMenu from "../menuWidgets/BottomMenu";
import RightWidget from "../geoclimateWidgets/RightWidget";
import SideMenu from "../sideMenuWidgets/SideMenu";
import AmenitiesMenu from "../amenitiesMenuWidgets/AmenitiesMenu";
import type { ProjectModel } from "../../api/projects/ProjectModel";

interface ProjectListProp {
    projectsList: ProjectModel[];
}

export function FullBottomWidget({ projectsList }: ProjectListProp) {
    const location = "kl";
    const [bottomMenu, setBottomMenu] = useState<string>("home"); // "home" | "projects" | "chat" | "amenities" | "whatsapp"
    const [sideMenu, setSideMenu] = useState<string>("region"); // "region" | "project" | "projectInfo" | "landmarkInfo"
    const [regionMenu, setRegionMenu] = useState<string>(location); // "kl" | "selangor" | "genting" | "jb"
    const [amenities, setAmenities] = useState<any>("");
    const [subMenu, setSubMenu] = useState<string>("home");
    const [mapType, setMapType] = useState("3d");

    
    
    return (
        <div className="widget">
            {(bottomMenu === "projects") && <SideMenu projectsList={projectsList} sideMenu={sideMenu} regionMenu={regionMenu} setRegionMenu={setRegionMenu} closeBtn={() => {
                //setSelectedProject(null);
                setBottomMenu("home");
                setSideMenu("region");
            }} />}
            {bottomMenu === "amenities" && <AmenitiesMenu location={location} distance={-1} subMenu={subMenu} amenities={amenities} setAmenities={setAmenities} />}
            <RightWidget mapType={mapType} location={location} setMapType={setMapType} />
            <BottomMenu bottomMenu={bottomMenu} setBottomMenu={setBottomMenu} setSideMenu={() => setSideMenu("region")} />
        </div>
    );
}
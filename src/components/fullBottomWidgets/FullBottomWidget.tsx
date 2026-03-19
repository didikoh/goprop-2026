import BottomMenu from "../menuWidgets/BottomMenu";
import RightWidget from "../geoclimateWidgets/RightWidget";
import SideMenu from "../sideMenuWidgets/SideMenu";
import AmenitiesMenu from "../amenitiesMenuWidgets/AmenitiesMenu";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";

export function FullBottomWidget() {
    // const [location, setLocation] = useState<string>("kl");
    const { selectedMenu: bottomMenu } = useBottomMenuStore(); // "home" | "projects" | "chat" | "amenities" | "whatsapp"
    //const { selectedMenu: sideMenu, setSelectedMenu: setSideMenu } = useSideMenuStore(); // "region" | "project" | "projectInfo" | "landmarkInfo"
    // const [amenities, setAmenities] = useState<any>("");
    // const [subMenu, setSubMenu] = useState<string>("home");
    // const [mapType, setMapType] = useState("3d");
    
    return (
        <div className="widget">
            {(bottomMenu === "projects") && <SideMenu />}
            {(bottomMenu === "amenities") && <AmenitiesMenu />}
            <RightWidget />
            <BottomMenu />
        </div>
    );
}
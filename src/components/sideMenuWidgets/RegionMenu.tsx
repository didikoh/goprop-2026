import { useLocationStore } from "../../stores/locationStore";
import { useProjectStore } from "../../stores/projectStore";
import { useRegionMenuStore } from "../../stores/regionMenuStore";
import { useSideMenuStore } from "../../stores/sideMenuStore";
import "./styles/RegionMenu.css";

export interface RegionItem {
    name: string;
    location: string;
    icon: string;
    iconHighlight: string;
}

const RegionMenu = () => {
    const regionDir = "src/assets/icons/RegionMenu";
    const { setSelectedMenu: setSideMenu } = useSideMenuStore();
    const { selectedMenu: regionMenu, setSelectedMenu: setRegionMenu } = useRegionMenuStore();
    const { location: location, setLocation: setLocation } = useLocationStore();
    const { setProject: setSelectedProject } = useProjectStore();

    function newRegionItem(name: string, location: string, icon: string, iconHighlight: string) {
        return { name, location, icon, iconHighlight };
    }

    const regionItems: Record<string, RegionItem> = {
        KL: newRegionItem("Kuala Lumpur", "kl", `${regionDir}/KL.svg`, `${regionDir}/KL-highlight.svg`),
        SLG: newRegionItem("Selangor", "selangor", `${regionDir}/Selangor.svg`, `${regionDir}/Selangor-highlight.svg`),
        GH: newRegionItem("Genting Highlands", "genting", `${regionDir}/Genting.svg`, `${regionDir}/Genting-highlight.svg`),
        JB: newRegionItem("Johor Bahru", "jb", `${regionDir}/JB.svg`, `${regionDir}/JB-highlight.svg`),
    };

    return (
        <div className="region-menu">
            <div className="region-menu__content">
                <p>Search Project By Region</p>
                <div className="region-menu__list">
                    {Object.entries(regionItems).map(([key, item]) => (
                        <div
                            className={`region-menu__item ${
                                (regionMenu === item.location) ? "active" : ""
                            } ${(item.location === "selangor") ? "disable" : ""}`}
                            key={key}
                            onClick={() => {
                                if (location === item.location) {
                                    setRegionMenu(item.location);
                                    setSideMenu("project");
                                } else {
                                    setRegionMenu(item.location);
                                    setLocation(item.location);
                                    setSelectedProject(null);
                                }
                            }}
                        >
                            <div className="region-menu__item-icon">
                                <img src={(regionMenu === item.name) ? item.iconHighlight : item.icon} alt={item.name} />
                            </div>
                            <div className="region-menu__item-text">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegionMenu;

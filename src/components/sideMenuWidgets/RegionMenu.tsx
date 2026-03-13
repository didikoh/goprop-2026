// import { useAppContext } from "@context/AppContext";

export interface RegionItem {
    name: string;
    location: string;
    icon: string;
    iconHighlight: string;
}

interface RegionProp {
    location: string;
    regionMenu: string;
    setRegionMenu: (menu: string) => void;
}

const RegionMenu = ({ location, regionMenu, setRegionMenu }: RegionProp) => {
//   const {
//     regionMenu,
//     setRegionMenu,
//     setSideMenu,
//     location,
//     setLocation,
//     setSelectedProject,
//   } = useAppContext();
    const regionDir = "src/assets/icons/RegionMenu";

    const regionItems: Record<string, RegionItem> = {
        KL: {
            name: "Kuala Lumpur",
            location: "kl",
            icon: `${regionDir}/KL.svg`,
            iconHighlight: `${regionDir}/KL-highlight.svg`,
        },
        SLG: {
            name: "Selangor",
            location: "selangor",
            icon: `${regionDir}/Selangor.svg`,
            iconHighlight: `${regionDir}/Selangor-highlight.svg`,
        },
        GH: {
            name: "Genting Highlands",
            location: "genting",
            icon: `${regionDir}/Genting.svg`,
            iconHighlight: `${regionDir}/Genting-highlight.svg`,
        },
        JB: {
            name: "Johor Bahru",
            location: "jb",
            icon: `${regionDir}/JB.svg`,
            iconHighlight: `${regionDir}/JB-highlight.svg`,
        },
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
                            } ${item.location === "selangor" ? "disable" : ""}`}
                            key={key}
                            onClick={() => {
                                if (location === item.location) {
                                    setRegionMenu(item.location);
                                    //setSideMenu("project");
                                } else {
                                    setRegionMenu(item.location);
                                    //   setLocation(item.location);
                                    //   setSelectedProject(null);
                                }
                            }}
                        >
                            <div className="region-menu__item-icon">
                                <img
                                    src={
                                        regionMenu === item.name ? item.iconHighlight : item.icon
                                    }
                                    alt={item.name}
                                />
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

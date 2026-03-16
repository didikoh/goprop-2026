import "./styles/BottomMenu.css";
import { MenuItem } from "./models/MenuTypes";
import { useBottomMenuStore } from "../../stores/bottomMenuStore";
import { useSideMenuStore } from "../../stores/sideMenuStore";
import { useProjectStore } from "../../stores/projectStore";

const BottomMenu = () => {
  const { selectedMenu: bottomMenu, setSelectedMenu: setBottomMenu } = useBottomMenuStore();
  const { setSelectedMenu: setSideMenu } = useSideMenuStore();
  const { setProject: setSelectedProject } = useProjectStore();
  const menuIconDir = "src/assets/icons/BottomMenu";
  const privacyUrl = "https://goprop.ai/my-dev/privacy/";

  const newMenuItem = (name: string, icon: string, iconHighlight: string) => {
    return { name, icon, iconHighlight };
  };

  const menuItems: Record<string, MenuItem> = {
    home: newMenuItem("home", `${menuIconDir}/home.svg`, `${menuIconDir}/home-highlight.svg`),
    projects: newMenuItem("projects", `${menuIconDir}/project.svg`, `${menuIconDir}/project-highlight.svg`),
    chat: newMenuItem("chat", `${menuIconDir}/chat.svg`, `${menuIconDir}/chat-highlight.svg`),
    amenities: newMenuItem("amenities", `${menuIconDir}/amenities.svg`, `${menuIconDir}/amenities-highlight.svg`),
    whatsapp: newMenuItem("whatsapp", `${menuIconDir}/whatsapp.svg`, `${menuIconDir}/whatsapp-highlight.svg`),
  };

  return (
    <div className="bottom-menu2">
      <div className="bottom-menu2__list">
        {Object.entries(menuItems).map(([key, item]) =>
         item.name === "whatsapp" ? (
            <a
              href="https://wa.me/60102216326/?text=Hello,%20I%20am%20interested%20in%20GoProp"
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-menu2__whatsapp-link"
              key={key}
            >
              <button className="bottom-menu2__item">   
                <img src={item.icon} alt={item.name} />
              </button>
            </a>
          ) : (
            <button
              className="bottom-menu2__item"
              key={key}
              onClick={() => {
                setBottomMenu((bottomMenu === item.name) ? "home" : (item.name ?? ""));
                if (item.name === "projects") {
                  setSideMenu("region");
                }
                setSelectedProject(null);
              }}
            >
              <img
                src={(bottomMenu === item.name) ? item.iconHighlight : item.icon}
                alt={item.name}
              />
            </button>
          )
        )}
      </div>
      <div className="bottom-menu2__links">
        <p>
          2025 GoProp.ai Beta <span></span>
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default BottomMenu;
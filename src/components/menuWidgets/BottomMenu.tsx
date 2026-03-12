import { useState } from "react";
import "./styles/BottomMenu.css";
import { MenuItem } from "./models/MenuTypes";

interface MenuProp {
    bottomMenu: string;
    setBottomMenu: () => void;
}

const BottomMenu = () => {
    const [bottomMenu, setBottomMenu] = useState<string>("home");

    const menuIconDir = "src/assets/icons/BottomMenu";
    const privacyUrl = "https://goprop.ai/my-dev/privacy/";

  const menuItems: Record<string, MenuItem> = {
    home: {
      name: "home",
      icon: `${menuIconDir}/home.svg`,
      iconHighlight: `${menuIconDir}/home-highlight.svg`,
    },
    projects: {
      name: "projects",
      icon: `${menuIconDir}/project.svg`,
      iconHighlight: `${menuIconDir}/project-highlight.svg`,
    },
    chat: {
      name: "chat",
      icon: `${menuIconDir}/chat.svg`,
      iconHighlight: `${menuIconDir}/chat-highlight.svg`,
    },
    amenities: {
      name: "amenities",
      icon: `${menuIconDir}/amenities.svg`,
      iconHighlight: `${menuIconDir}/amenities-highlight.svg`,  
    },
    whatsapp: {
      name: "whatsapp",
      icon: `${menuIconDir}/whatsapp.svg`,
      iconHighlight: `${menuIconDir}/whatsapp-highlight.svg`,
    },
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
                // setBottomMenu(bottomMenu === item.name ? "home" : item.name);
                // if (item.name === "projects") {
                //   setSideMenu("region");
                // }
                // setSelectedProject(null);
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
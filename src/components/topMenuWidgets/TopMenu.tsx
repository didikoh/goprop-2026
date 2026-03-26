import axios from "axios";
//import "./styles/TopMenu.css";
//import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import { useLocationStore } from "../../stores/locationStore";

const TopMenu = () => {
  // const {
  //   location,
  //   user,
  //   setUser,
  //   weather,
  //   setWeather,
  //   API_URL,
  //   changeVisItem,
  //   setCameraAutoRotate,
  //   resetCam,
  // } = useAppContext();
  const { location } = useLocationStore();
  const [tempWeather, setTempWeather] = useState<string>("");
  const settingMenu = document.getElementById("settingMenu");
  const profileMenu = document.getElementById("profile-menu");
  const dashbaord = document.getElementById("dashboard-section");
  const loginScreen = document.getElementById("login-in-modal");

  const toggleSettingMenu = () => {
    settingMenu?.classList.toggle("show");
    profileMenu?.classList.remove("show");
  };

  // const toggleProfileMenu = () => {
  //   user
  //     ? profileMenu?.classList.toggle("show")
  //     : loginScreen?.classList.toggle("show");
  //   settingMenu?.classList.remove("show");
  // };

  const toggleDashbaord = () => {
    profileMenu?.classList.remove("show");
    dashbaord?.classList.toggle("show");
  };

  const toggleSetting = (id: string, value: boolean) => {
    switch (id) {
      case "toggle-building":
        // if (changeVisItem.current) {
        //   if (changeVisItem.current) {
        //     changeVisItem.current("buildings_white.001", value);
        //   }
        // }
        break;
      case "toggle-auto-rotate":
        // if (setCameraAutoRotate.current) {
        //   setCameraAutoRotate.current(value);
        // }
        break;
      case "toggle-weather":
        // if (value) {
        //   setTempWeather(weather);
        //   setWeather("day debug");
        // } else {
        //   setWeather(tempWeather);
        // }

        break;
      case "toggle-full-screen":
        toggleFullScreen(value);
        break;
    }
  };

  // const handleLogout = async () => {
  //   await axios.post(
  //     `${API_URL}/auth.php?action=logout`,
  //     {},
  //     { withCredentials: true }
  //   );
  //   setUser(null);
  //   // 新增：写入 localStorage 标记
  //   localStorage.setItem("logout", Date.now().toString());
  //   toggleProfileMenu();
  //   alert("Logged out successfully");
  //   window.location.reload();
  // };

  const toggleFullScreen = (t: boolean) => {
    if (t) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="top-menu">
      <div className="top-menu-left">
        <button id="button-reset-view" onClick={() => {/*resetCam.current()*/}}>
          <img src="./assets/topmenu/goprop.svg" alt="Reset View" />
        </button>
      </div>

      <div className="top-menu-right" id="top-menu-right">
        <button
          className="setting-btn"
          id="setting-btn"
          onClick={toggleSettingMenu}
        >
          <img
            id="settingBtn"
            src="./assets/topmenu/setting.svg"
            alt="Settings"
          />
        </button>
        <div id="settingMenu" className="setting">
          {[
            { label: "Settings", id: "settings" },
            { label: "Surrounding Buildings", id: "toggle-building" },
            { label: "Camera Auto-Rotation", id: "toggle-auto-rotate" },
            { label: "Disable Weather Effect", id: "toggle-weather" },
            { label: "Full Screen", id: "toggle-full-screen" },
          ]
            .filter(
              ({ id }) => id !== "toggle-building" || location !== "genting"
            )
            .map(({ label, id }) => (
              <div className="toggle-container-wrapper" key={id}>
                <div className="toggle-container">
                  <p
                    className={id}
                    onClick={() => id === "settings" && toggleSettingMenu()}
                  >
                    {label}
                  </p>
                  {id !== "settings" && (
                    <>
                      <input
                        type="checkbox"
                        id={id}
                        className="toggle"
                        defaultChecked={id === "toggle-building"}
                        onChange={(event) =>
                          toggleSetting(id, event.target.checked)
                        }
                      />
                      <label htmlFor={id} className="toggle-label"></label>
                    </>
                  )}
                </div>
                {label !== "Full Screen" && <hr />}
              </div>
            ))}
        </div>

        {/* {user ? (
          <button
            className="user-profile"
            id="user-profile"
            onClick={toggleProfileMenu}
          >
            {user.lastName[0].toUpperCase()}
          </button>
        ) : ( */}
          <>
            <button
              className="login-btn"
              id="login-btn"
              //onClick={toggleProfileMenu}
            >
              Login
            </button>
          </>
        {/* )} */}

        
        {/* <div id="profile-menu" className="setting">
          {[
            { label: "Profile", id: "profile-settings" },
            { label: "User Account", id: "profile-user-account" },
            { label: "Logout", id: "profile-logout-button" },
          ].map(({ label, id }) => (
            <div className="toggle-container-wrapper" key={id}>
              <div className="toggle-container" key={id}>
                <button
                  className="profile-menu-button"
                  id={id}
                  onClick={
                    label === "Logout"
                      ? handleLogout
                      : label === "User Account"
                      ? user
                        ? toggleDashbaord
                        : undefined
                      : undefined
                  }
                >
                  <p
                    className={`profile-menu-text ${
                      label === "Profile" && "profile-menu-header"
                    }`}
                    onClick={
                      label === "Profile" ? toggleProfileMenu : undefined
                    }
                  >
                    {label}
                  </p>
                </button>
              </div>
              {label !== "Logout" && <hr />}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default TopMenu;

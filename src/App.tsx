import { useState } from "react";
import "./App.css";
import BottomMenu from "./components/menuWidgets/BottomMenu";
import MainLoading from "./pages/MainLoading";
import MainScene from "./scenes/MainScene";
import { FullBottomWidget } from "./components/fullBottomWidgets/FullBottomWidget";
import RightWidget from "./components/geoclimateWidgets/RightWidget";

function App() {
  const [bottomMenu, setBottomMenu] = useState<string>("home");

  const [location, setLocation] = useState(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get("location") || "kl";
  });

  return (
    <>
      <MainLoading />
      <MainScene />
      <div className="widget">
            <RightWidget mapType="3d" location="kl" />
            <BottomMenu />
      </div>
    </>
  );
}

export default App;

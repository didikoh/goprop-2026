import { useEffect, useRef, useState } from "react";
import "./styles/RightWidget.css";
//import axios from "axios";
//import { useDispatch, useSelector } from "react-redux";
//import { AppDispatch, RootState } from "../../store/index";
// import { setDirection } from "../../store/compassSlice";
// import { setWeatherJsonData } from "../../store/weatherSlice";

interface WeatherData {
  temperature: string;
  weatherText: string;
  wind: string;
  icon: string;
}

interface GeoProp {
  mapType: string;
  location: string;
}

const RightWidget = ({ mapType, location }: GeoProp) => {
  // const {
  //   location,
  //   setWeather,
  //   weather,
  //   loadState,
  //   mapType,
  //   setMapType,
  //   applyWeatherEffect,
  //   moveToNorth
  // } = useAppContext();
  //const compass_dir = useSelector((state: RootState) => state.compass.direction);
  const moveToNorth = useRef<(() => void) | null>(null);

  //const dispatch = useDispatch<AppDispatch>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isDebugWeather, setIsDebugWeather] = useState(false);
  const [debugWeatherIcon, setDebugWeatherIcon] = useState(
    "https://cdn.weatherapi.com/weather/128x128/day/176.png"
  );
  const [compassPrevRotate, setCompassPrevRotate] = useState(0);
  const [compassRotate, setCompassRotate] = useState(0);
  const [weather, setWeather] = useState<string>("");

  // useEffect(() => {
  //   // compass_dir is in radians, convert to degrees for rotation
  //   setCompassRotate((compass_dir * 180) / Math.PI + (270));
  // }, [compass_dir])

  const fetchWeather = async () => {
    try {
      const json = await axios.get(`./json/weather.json`);
      //dispatch(setWeatherJsonData(json.data || {}));
    } catch (err: any) {
      console.error("Error fetching weather JSON:", err.message);
    }

    const city = getCityByLocation(location);
    if (!city) return;

    try {
      const { data } = await axios.get(
        import.meta.env.VITE_WEATHER_URL + `?q=${city}`
      );
      const newWeather = data.current.condition.text;
      setWeatherData({
        temperature: `${Math.round(data.current.temp_c)}°C`,
        weatherText: newWeather,
        wind: `Wind ${data.current.wind_kph} km/h`,
        icon: data.current.condition.icon,
      });
      setWeather((prev: any) =>
        prev === newWeather ? newWeather + "_1" : newWeather
      );
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // useEffect(() => {
  //   if (!loadState) {
  //     return;
  //   }
  //   fetchWeather(); // ✅ 在这里调用一次就够了
  // }, [loadState]);

  const getCityByLocation = (location: string): string | null => {
    const cities: Record<string, string> = {
      kl: "Kuala Lumpur",
      genting: "3.423650875459618,101.79476551219621",
      jb: "Johor Bahru",
    };
    return cities[location] || null;
  };

  useEffect(() => {

    //applyWeatherEffect.current?.(weather);

  }, [weather]);

  const weatherCycle = [
    {
      type: "day rain debug",
      icon: "https://cdn.weatherapi.com/weather/128x128/day/176.png",
    },
    {
      type: "night debug",
      icon: "https://cdn.weatherapi.com/weather/128x128/night/113.png",
    },
    {
      type: "night rain debug",
      icon: "https://cdn.weatherapi.com/weather/128x128/night/176.png",
    },
    {
      type: "day rain thunder debug",
      icon: "https://cdn.weatherapi.com/weather/128x128/day/389.png",
    },
    {
      type: "day debug",
      icon: "https://cdn.weatherapi.com/weather/128x128/day/113.png",
    },
  ];

  const debugWeather = () => {
    const currentIndex = weatherCycle.findIndex((w) => w.type === weather);
    const next = weatherCycle[(currentIndex + 1) % weatherCycle.length];
    setWeather(next.type);
    setDebugWeatherIcon(next.icon);
    setIsDebugWeather(true);
  };

  useEffect(() => {
    if (mapType == "2d") {
      //setCompassPrevRotate(compass_dir);
      //dispatch(setDirection(-3 * Math.PI)); // Reset compass direction for 2D map
    } else {
      //dispatch(setDirection(compassPrevRotate));
    }
  }, [mapType]);

  return (
    <div className="widget-bottom-right" id="widget-bottom-right">
      <div
        className="mapType-wrapper"
        id="mapType-wrapper"
        onClick={() => {
          //setMapType(mapType === "2d" ? "3d" : "2d");
        }}
      >
        <div className="mapType-text">{mapType === "2d" ? "2D" : "3D"}</div>
      </div>
      <div
        className="compass-wrapper"
        id="compass-wrapper"
        onClick={() => moveToNorth.current?.()}
        style={{ pointerEvents: mapType === "2d" ? "none" : "auto" }}
      >
        <button className="compass-btn-north" id="compass-btn-north" style={{ transform: `rotate(${compassRotate}deg)` }}>
          <img
            className="compass-pointer"
            src="./assets/widget/widgetright/compass.png"
            alt=""
          />
        </button>
      </div>

      <div
        className="weather-wrapper"
        id="weather-wrapper"
        onClick={() => {
          debugWeather();
        }}
      >
        <img
          id="weather-image"
          className="weather-image"
          src={
            isDebugWeather
              ? debugWeatherIcon
              : weatherData?.icon || "./assets/widget/widgetright/clear.png"
          }
          alt="weather"
        />
        <div className="weather-text">{weatherData?.temperature}</div>
      </div>
    </div>
  );
};

export default RightWidget;
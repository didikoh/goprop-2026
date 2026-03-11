import { useEffect, useState } from "react";
import { useLoadingStore } from "../stores/loadingStore";
import styles from "./MainLoading.module.css";

const mapping: Record<string, string> = {
  kl: "Kuala Lumpur",
  genting: "Genting Highlands",
  jb: "Johor Bahru",
};

const MainLoading = () => {
  const location =
    new URLSearchParams(window.location.search).get("location") || "kl";
  const loading = useLoadingStore((state) => state.loading);
  const resetLoading = useLoadingStore((state) => state.resetLoading);
  const [isClosed, setIsClosed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const locationFull = mapping[location] || "Kuala Lumpur";

  useEffect(() => {
    resetLoading();
    setLoaded(false);
  }, [resetLoading]);

  useEffect(() => {
    setLoaded(loading >= 101);
  }, [loading]);

  return (
    <>
      <section
        className={styles["loading-screen"]}
        style={{
          display: isClosed ? "none" : "block",
        }}
        id="home"
      >
        <div
          className={`${styles["loading-screen__container"]} ${loaded ? styles["loading-screen__container--finished"] : ""}`.trim()}
        >
          <video
            className={styles["loading-screen__video"]}
            src={
              location === "kl"
                ? `${
                    import.meta.env.BASE_URL
                  }assets/loadingscreen/Sunrise Final v4.webm`
                : location === "genting"
                  ? `${
                      import.meta.env.BASE_URL
                    }assets/loadingscreen/Genting Sunrise Final_10s_Logo_1.webm`
                  : location === "jb"
                    ? `${
                        import.meta.env.BASE_URL
                      }assets/loadingscreen/JB Sunrise Final_1.webm`
                    : `${
                        import.meta.env.BASE_URL
                      }assets/loadingscreen/Sunrise Final v4.webm`
            }
            autoPlay
            loop
            muted
            playsInline
            style={{ display: loaded ? "none" : "block" }}
          ></video>
          <div className={styles["loading-screen__content"]}>
            <div
              className={styles["loading-screen__text-wrapper"]}
              style={{ color: loaded ? "#fff" : "#000" }}
            >
              <h3 className={styles["loading-screen__subtitle"]}>
                WE ARE GOPROP
              </h3>
              <h1 className={styles["loading-screen__title"]}>
                Where property <br />
                meets AI
              </h1>
            </div>
            <div
              className={
                loaded
                  ? `${styles["loading-screen__buttons-container"]} ${styles["loading-screen__buttons-container--visible"]}`
                  : styles["loading-screen__buttons-container"]
              }
              id="landing-btns-container"
            >
              <button
                className={styles["loading-screen__buttons-item"]}
                id="explore-btn"
                onClick={() => setIsClosed(true)}
              >
                Explore
              </button>
              <button
                className={styles["loading-screen__buttons-item"]}
                id="tutorial-btn"
                onClick={() => {}}
              >
                Tutorial
              </button>
            </div>
          </div>

          <div
            className={styles["loading-screen__progress-container"]}
            id="loading-bar-container"
            style={{ display: loaded ? "none" : "flex" }}
          >
            <div
              className={styles["loading-screen__progress-bar"]}
              id="loadingBar"
              style={{ width: `${loading}%` }}
            ></div>
          </div>
          <div className={styles["loading-screen__loading-text-container"]}>
            <p
              className={`${styles["loading-screen__loading-text-location"]} ${
                loaded
                  ? styles["loading-screen__loading-text-location--finished"]
                  : ""
              }`}
              id="loading-text-location"
            >
              Latest Properties in <br />
              {locationFull}
            </p>
            {/* <p className={"loading-screen__loading-text-msg"} id="loading-text-msg">
              Initialize...
            </p> */}
            <p
              className={styles["loading-screen__loading-text-percent"]}
              id="loading-text"
              style={{ display: loaded ? "none" : "block" }}
            >
              {loading.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainLoading;

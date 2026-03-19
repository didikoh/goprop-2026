import React, { useEffect } from "react";
import { GoworldApp } from "../babylon/App";
import { useLoadingStore } from "../stores/loadingStore";

const MainScene1 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const goworldApp = new GoworldApp(canvas, setLoading);
    void goworldApp.init();

    return () => {
      goworldApp.dispose();
    };
  }, [setLoading]);

  return (
    <canvas
      style={{
        position: "fixed",
        width: "100svw",
        height: "100svh",
        top: 0,
        left: 0,
      }}
      ref={canvasRef}
    ></canvas>
  );
};

export default MainScene1;

import { useEffect, useRef, useState } from "react";
import {
  Scene,
  ArcRotateCamera,
  Engine,
  KeyboardEventTypes,
  Color4,
  ImportMeshAsync,
  ShadowGenerator,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import { ShowInspector, type InspectorToken } from "@babylonjs/inspector";
import style from "./MainScene.module.css";
import { useLoadingStore } from "../stores/loadingStore";
import { initLighting } from "./sceneUtils/initLighting";
import { initShadow } from "./sceneUtils/initShadow";
import { initCamera } from "./sceneUtils/initCamera";

const MainScene = () => {
  const initEngine = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const inspectorRef = useRef<InspectorToken|null>(null);

  const [model, setModel] = useState();
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentCamera, setCurrentCamera] = useState<ArcRotateCamera | null>(
    null,
  );
  const shadowGeneratorRef = useRef<ShadowGenerator | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    if (model && currentScene && currentCamera) {
      setLoading(105);

      return () => {};
    }
  }, [model, currentScene, currentCamera, setLoading]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }

    if (initEngine.current) {
      console.warn("Engine already initialized, skipping re-initialization.");
      return;
    }
    initEngine.current = true;

    const createEngine = async () => {
      const webglEngine = new Engine(canvas, true, {
        antialias: true,
        alpha: true,
      });
      webglEngine.useReverseDepthBuffer = true;

      return webglEngine;
    };

    createEngine().then(async (engine) => {
      const handleResize = () => engine.resize(); // 当窗口大小改变时，调整引擎的大小
      window.addEventListener("resize", handleResize); // 监听窗口大小变化事件

      engineRef.current = engine;

      const createScene = () => {
        const scene = new Scene(engine); // 创建一个新的 Babylon.js 场景

        if (!scene || !engine) {
          console.error("Scene or engine not initialized!");
          return;
        }

        // const KNOWN_TOTAL = 100;

        // 加载模型
        ImportMeshAsync("./models/kl.glb", scene, {
          onProgress: (ev) => {
            // ev 的结构见 ISceneLoaderProgressEvent
            // { lengthComputable, loaded, total }
            if (ev.lengthComputable && ev.total > 0) {
              const percent = (ev.loaded / ev.total) * 100;
              setLoading(Math.min(percent, 100));
            } else {
              // gzip + 我们知道大小
              // const percent = (ev.loaded / KNOWN_TOTAL) * 100;
              setLoading(Math.min(ev.loaded, 100));
            }
          },
        })
          .then((result: any) => {
            setModel(result); // 更新状态以存储加载的模型
            if (result.animationGroups) {
              result.animationGroups.forEach((animationGroup: any) =>
                animationGroup.start(true),
              ); //
            }
          })
          .catch((error) => console.error("Failed to load model:", error)); // 捕获加载模型的错误

        const sunlight = initLighting(scene);
        const camera = initCamera(scene, canvas);

        setCurrentCamera(camera); // 更新状态以存储当前相机
        scene.activeCamera = camera; // 设置当前活动相机

        scene.clearColor = new Color4(0, 0, 0, 0);
        // engine.clear(scene.clearColor, true, true); // 清除蓝底

        // 调整 PBR 渲染参数
        scene.imageProcessingConfiguration.exposure = 1;
        scene.imageProcessingConfiguration.contrast = 1.3;
        scene.imageProcessingConfiguration.toneMappingEnabled = true;

        return scene; // 返回创建的场景
      };

      const scene = await createScene(); // 调用 createScene 函数创建场景
      if (!scene) {
        console.error("Failed to create scene!");
        return;
      }

      setCurrentScene(scene); // 更新状态以存储当前场景

      // Inspector 快捷键绑定
      scene.onKeyboardObservable.add(({ event, type }) => {
        if (
          type === KeyboardEventTypes.KEYDOWN &&
          event.ctrlKey &&
          event.key.toLowerCase() === "i" &&
          scene
        ) {
          if(inspectorRef.current) {
            inspectorRef.current.dispose();
            inspectorRef.current = null;
            return;
          }
          inspectorRef.current = ShowInspector(scene);
        }
      });

      engine.runRenderLoop(() => scene.render()); // 在每一帧渲染场景

      return () => {
        window.removeEventListener("resize", handleResize); // 移除窗口大小变化事件监听器
        scene.dispose(); // 释放场景资源
        engine.dispose(); // 释放引擎资源
        engineRef.current = null;
      };
    });
  }, []);

  return (
    <div className={style.scene}>
      <canvas className={style.myCanvas} ref={canvasRef}></canvas>
    </div>
  );
};

export default MainScene; // 导出 Scene 组件

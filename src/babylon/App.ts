import {
  ArcRotateCamera,
  Color3,
  CubeTexture,
  DirectionalLight,
  Engine,
  ImportMeshAsync,
  KeyboardEventTypes,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { ShowInspector } from "@babylonjs/inspector";

export class GoworldApp {
  canvas: HTMLCanvasElement;
  public engine: Engine;
  public scene: Scene;
  private setLoading: ((loading: number) => void) | undefined;
  private inspectorRef: any = null;
  private renderLoop = () => {
    if (!this.scene.isDisposed) {
      this.scene.render();
    }
  };

  constructor(
    canvas: HTMLCanvasElement,
    setLoading: (loading: number) => void,
  ) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true);
    this.setLoading = setLoading;
    this.scene = new Scene(this.engine);
  }

  public async init() {
    this.createCamera();
    this.createLight();
    await this.loadModels(this.setLoading);
    this.registerEvents();
    this.startRenderLoop();
    this.registerInspector();
  }

  private createCamera() {
    const camera = new ArcRotateCamera(
      "my_camera",
      2.8,
      1.3,
      2100,
      new Vector3(-8998, 100, -13614),
      this.scene,
    );
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 4000;
    camera.wheelPrecision = 1;
    camera.wheelDeltaPercentage = 0.01;
    camera.lowerBetaLimit = 0.7;
    camera.upperBetaLimit = 1.37;
    camera.panningSensibility = 20;
    camera.panningInertia = 0.9;
    camera.angularSensibilityY = 2500;
    camera.angularSensibilityX = 2500;
    camera.minZ = 1;
    camera.maxZ = 0;
    camera.speed = 1;
    camera.fov = 1;
  }

  private createLight() {
    const direction = new Vector3(1, -0.5, -1).normalize();
    const center = new Vector3(0, 0, 0);
    const sunlight = new DirectionalLight("sunlight", direction, this.scene);
    sunlight.position = center.add(direction.scale(-600));
    sunlight.intensity = 3;
    sunlight.diffuse = new Color3(1, 1, 1);
    sunlight.specular = new Color3(1, 1, 1);
    sunlight.shadowEnabled = true;
    sunlight.autoCalcShadowZBounds = true;

    const skyTexture = new CubeTexture("/textures/environment.env", this.scene);
    const skybox = this.scene.createDefaultSkybox(skyTexture, true, 50000, 0);
    if (skybox) skybox.infiniteDistance = true;
    this.scene.environmentTexture = skyTexture;
    this.scene.environmentIntensity = 1.6;
  }

  private async loadModels(
    setLoading: ((loading: number) => void) | undefined,
  ) {
    const result = await ImportMeshAsync("/models/kl.glb", this.scene, {
      onProgress: (ev) => {
        // ev 的结构见 ISceneLoaderProgressEvent
        // { lengthComputable, loaded, total }
        if (ev.lengthComputable && ev.total > 0) {
          const percent = (ev.loaded / ev.total) * 100;
          setLoading?.(Math.min(percent, 100));
        } else {
          // gzip + 我们知道大小
          // const percent = (ev.loaded / KNOWN_TOTAL) * 100;
          setLoading?.(Math.min(ev.loaded, 100));
        }
      },
    }).catch((error) => {
      console.error("Failed to load model:", error);
      return null;
    });

    if (!result) {
      return;
    }

    if (result.animationGroups) {
      result.animationGroups.forEach((animationGroup: any) =>
        animationGroup.start(true),
      );
    }
  }

  private registerEvents() {}

  private registerInspector() {
    this.scene.onKeyboardObservable.add(({ event, type }) => {
      if (
        type === KeyboardEventTypes.KEYDOWN &&
        event.ctrlKey &&
        event.key.toLowerCase() === "i" &&
        this.scene
      ) {
        if (this.inspectorRef) {
          this.inspectorRef.dispose();
          this.inspectorRef = null;
          return;
        }
        this.inspectorRef = ShowInspector(this.scene);
      }
    });
  }

  private startRenderLoop() {
    this.engine.runRenderLoop(this.renderLoop);
  }

  public dispose() {
    this.engine.stopRenderLoop(this.renderLoop);
    this.scene.dispose();
    this.engine.dispose();
  }
}

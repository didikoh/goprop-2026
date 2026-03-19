import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";

export const initCamera = (
  scene: Scene,
  canvas: HTMLCanvasElement,
): ArcRotateCamera => {
  const camera = new ArcRotateCamera(
    "my_camera",
   2.8, 
    1.3, 
    2100, 
    new Vector3(-8998, 100, -13614), 
    scene,
  );
  camera.attachControl(canvas, true);
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

  return camera;
};

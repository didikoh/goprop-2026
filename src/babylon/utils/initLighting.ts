import {
  Color3,
  CubeTexture,
  DirectionalLight,
  Scene,
  Vector3,
} from "@babylonjs/core";

export const initLighting = async (scene: Scene): Promise<DirectionalLight> => {
  const direction = new Vector3(1, -0.5, -1).normalize();
  const center = new Vector3(0, 0, 0);
  const sunlight = new DirectionalLight("sunlight", direction, scene);
  sunlight.position = center.add(direction.scale(-600));
  sunlight.intensity = 3;
  sunlight.diffuse = new Color3(1, 1, 1);
  sunlight.specular = new Color3(1, 1, 1);
  sunlight.shadowEnabled = true;
  sunlight.autoCalcShadowZBounds = true;

  const skyTexture = new CubeTexture("./textures/environment.env", scene);
  const skybox = scene.createDefaultSkybox(skyTexture, true, 50000, 0);
  if (skybox) skybox.infiniteDistance = true;
  scene.environmentTexture = skyTexture;
  scene.environmentIntensity = 1.6;

  return sunlight;
};

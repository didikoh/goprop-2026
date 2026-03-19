import { DirectionalLight, ShadowGenerator } from "@babylonjs/core";

export const initShadow = (sunlight: DirectionalLight): ShadowGenerator => {
  const shadowGenerator = new ShadowGenerator(1024, sunlight);
  shadowGenerator.useBlurCloseExponentialShadowMap = true;
  shadowGenerator.setDarkness(0);
  shadowGenerator.bias = 0.0008;
  shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;

  return shadowGenerator;
};

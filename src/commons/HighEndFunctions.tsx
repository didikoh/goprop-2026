import { Scene, ArcRotateCamera, PointerEventTypes, PointerInfo, Vector3, MeshBuilder, Mesh, DynamicTexture, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export function Make3DLabels(scene: Scene | null, id?: number, x?: number, y?: number, z?: number) {
    if (scene) {
        const plane = MeshBuilder.CreateDisc("labelPlane", {radius: 0.6, tessellation: 64}, scene);
        plane.position = new Vector3(x, y, z);
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const dynamicTexture = new DynamicTexture("DynamicTexture", 512, scene, true, undefined, undefined, true);
        const material = new StandardMaterial("mat", scene);
        const ctx = dynamicTexture.getContext();
        ctx.beginPath();
        ctx.arc(512/2, 512/2, 512/2, 0, Math.PI*2);
        ctx.fill();
        
        material.emissiveTexture = dynamicTexture;
        material.opacityTexture = dynamicTexture;
        material.diffuseColor = new Color3(0, 0, 0);
        material.specularColor = new Color3(0, 0, 0);
        material.ambientColor = new Color3(0, 0, 0);
        material.disableLighting = true; 
        material.backFaceCulling = false;
        plane.material = material;
        plane.rotation.x = Math.PI;
        dynamicTexture.hasAlpha = true;
        plane.scaling = new Vector3(2.5, 2.5, 2.5);
        
        dynamicTexture.drawText(`${id}`, null, null, "bold 220px Arial", "#ffffff", "#f26e21", true);
        return plane;
    }
}

export function rerenderCameraPos(currentCamera: ArcRotateCamera | null, /*alpha: number, beta: number, rad: number,*/ camX: number, camY: number, camZ: number) {
    if (currentCamera) {
        requestAnimationFrame(() => {
            currentCamera.inertialAlphaOffset = 0;
            currentCamera.inertialBetaOffset = 0;
            currentCamera.inertialRadiusOffset = 0;
            currentCamera.inertialPanningX = 0;
            currentCamera.inertialPanningY = 0;

            const oldLowerLimit = currentCamera.lowerRadiusLimit;
            currentCamera.lowerRadiusLimit = null;

            currentCamera.setTarget(new Vector3(camX, camY, camZ), true, false, false);
            currentCamera.alpha = 0;
            currentCamera.beta = 60;
            currentCamera.radius = 150;

            currentCamera.lowerRadiusLimit = oldLowerLimit;
            currentCamera.computeWorldMatrix();
        });
    }
}



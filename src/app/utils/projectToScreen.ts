import * as THREE from "three";

export function projectToScreen(
    cameraDir: THREE.Vector3,
    camera: THREE.Camera,
    viewport: { width: number; height: number }
) {
    // Проєкція у NDC
    const ndc = cameraDir.clone().project(camera);

    return {
        x: (ndc.x * 0.5 + 0.5) * viewport.width,
        y: (-ndc.y * 0.5 + 0.5) * viewport.height,
        z: ndc.z, // корисно для перевірок
    };
}

import * as THREE from "three";

export function snapIfClose(
    cameraDir: THREE.Vector3,
    targetDir: THREE.Vector3,
    thresholdDeg = 2
) {
    const angle = cameraDir.angleTo(targetDir) * (180 / Math.PI);
    return angle < thresholdDeg;
}

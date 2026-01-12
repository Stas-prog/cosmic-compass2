import * as THREE from "three";

/**
 * Обчислює yaw (азимут) камери в градусах 0–360
 * на основі world direction.
 */
export function getYawFromCamera(
    camera: THREE.PerspectiveCamera
): number {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    // yaw = atan2(east, north)
    const yawRad = Math.atan2(dir.x, -dir.z);
    let yawDeg = yawRad * (180 / Math.PI);

    if (yawDeg < 0) yawDeg += 360;
    return yawDeg;
}

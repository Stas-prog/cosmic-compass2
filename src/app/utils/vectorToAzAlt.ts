import * as THREE from "three";

export function vectorToAzAlt(dir: THREE.Vector3) {
    const v = dir.clone().normalize();

    const altitude =
        Math.asin(v.y) * (180 / Math.PI);

    const azimuth =
        Math.atan2(v.x, -v.z) * (180 / Math.PI);

    return {
        azimuth: (azimuth + 360) % 360,
        altitude,
    };
}

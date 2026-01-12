import * as THREE from "three";

export function getEarthOrbitDirection(sunDir: THREE.Vector3) {
    const eclipticNormal = new THREE.Vector3(0, 1, 0);
    return new THREE.Vector3()
        .crossVectors(eclipticNormal, sunDir)
        .normalize();
}

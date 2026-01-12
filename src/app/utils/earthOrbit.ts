import * as THREE from "three";

/**
 * Напрям орбітального руху Землі:
 * дотична до екліптики, ортогональна напряму на Сонце.
 */
export function getEarthOrbitDirection(
    sunDirection: THREE.Vector3
): THREE.Vector3 {
    // Нормаль до площини екліптики (спрощено)
    const eclipticNormal = new THREE.Vector3(0, 1, 0);

    return new THREE.Vector3()
        .crossVectors(eclipticNormal, sunDirection)
        .normalize();
}

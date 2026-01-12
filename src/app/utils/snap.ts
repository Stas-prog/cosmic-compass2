import * as THREE from "three";

/**
 * Перевіряє, чи камера дивиться близько до цільового напрямку.
 * @param cameraDir напрям погляду камери (нормалізований)
 * @param targetDir напрям цілі (нормалізований)
 * @param thresholdDeg кут у градусах (рекомендую 2–3)
 */
export function isSnapped(
    cameraDir: THREE.Vector3,
    targetDir: THREE.Vector3,
    thresholdDeg = 2
): boolean {
    const angle =
        cameraDir.angleTo(targetDir) * (180 / Math.PI);
    return angle <= thresholdDeg;
}

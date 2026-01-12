import * as THREE from "three";

/**
 * Проєктує напрямок (вектор) на малу HUD-сферу
 * @param direction реальний напрямок (будь-якої довжини)
 * @param radius радіус HUD-сфери (напр. 8–12)
 */
export function projectToHud(
    direction: THREE.Vector3,
    radius: number
): THREE.Vector3 {
    return direction.clone().normalize().multiplyScalar(radius);
}

import * as THREE from "three";

export function getSunDirection(): THREE.Vector3 {
    // Поки що — умовний напрямок
    // Далі замінимо на реальні астрономічні формули
    return new THREE.Vector3(1, 0.2, -1).normalize();
}

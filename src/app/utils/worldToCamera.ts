import * as THREE from "three";

export function worldToCamera(
    worldDir: THREE.Vector3,
    camera: THREE.Camera
) {
    // Клонуємо, щоб не мутувати оригінал
    const v = worldDir.clone().normalize();

    // Переводимо у простір камери
    v.applyMatrix4(camera.matrixWorldInverse);

    return v;
}

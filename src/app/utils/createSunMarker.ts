import * as THREE from "three";

export function createSunMarker(direction: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(geometry, material);

    // Сонце на небесній сфері
    sun.position.copy(direction.normalize().multiplyScalar(200));

    return sun;
}

import * as THREE from "three";

export function createSunMarker(direction: THREE.Vector3) {
    const geo = new THREE.SphereGeometry(2, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(geo, mat);

    sun.position.copy(direction.clone().multiplyScalar(300));
    sun.name = "SUN";

    return sun;
}

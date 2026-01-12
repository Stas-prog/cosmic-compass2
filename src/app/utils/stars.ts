import * as THREE from "three";

export function createStarSphere(textureUrl?: string) {
    const geometry = new THREE.SphereGeometry(1200, 64, 64);

    const material = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        color: textureUrl ? 0xffffff : 0x0a0a2a,
        map: textureUrl
            ? new THREE.TextureLoader().load(textureUrl)
            : undefined,
    });

    return new THREE.Mesh(geometry, material);
}

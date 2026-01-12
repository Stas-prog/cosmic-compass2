import * as THREE from "three";

export type MarkerOptions = {
    color?: number;
    size?: number;
    name?: string;
};

export function createMarker(opts: MarkerOptions = {}) {
    const {
        color = 0xffffff,
        size = 0.3,
        name = "marker",
    } = opts;

    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    return mesh;
}

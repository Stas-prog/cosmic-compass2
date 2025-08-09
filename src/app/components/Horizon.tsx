import { useMemo } from "react";
import * as THREE from "three";

export default function Horizon() {
    const geometry = useMemo(() => new THREE.CircleGeometry(500, 64), []);
    const material = useMemo(
        () => new THREE.MeshBasicMaterial({ color: 0x0044ff, opacity: 0.3, transparent: true, side: THREE.DoubleSide }),
        []
    );

    const mesh = useMemo(() => {
        const circle = new THREE.Mesh(geometry, material);
        circle.rotation.x = -Math.PI / 2;
        return circle;
    }, [geometry, material]);

    return <primitive object={mesh} />;
}

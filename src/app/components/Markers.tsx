import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Marker {
    name: string;
    position: THREE.Vector3; // Точна позиція у світовому просторі
    color: string;
}

interface MarkersProps {
    markers: Marker[];
}

export default function Markers({ markers }: MarkersProps) {
    const markerMeshes = useMemo(
        () =>
            markers.map((marker) => {
                const mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(2, 16, 16),
                    new THREE.MeshBasicMaterial({ color: marker.color })
                );
                mesh.position.copy(marker.position);
                return mesh;
            }),
        [markers]
    );

    useFrame(() => {
        // Можна додати анімацію або мерехтіння
    });

    return (
        <>
            {markerMeshes.map((mesh, i) => (
                <primitive key={i} object={mesh} />
            ))}
        </>
    );
}

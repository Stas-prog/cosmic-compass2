'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import * as THREE from 'three';


interface ArrowToTargetProps {
    target: React.RefObject<Object3D>;
}

export default function ArrowToTarget({ target }: ArrowToTargetProps) {
    const arrowRef = useRef<THREE.Mesh>(null);
    const from = new Vector3(0, 0, 0);
    const to = new Vector3();

    useFrame(() => {
        if (!target.current || !arrowRef.current) return;

        target.current.getWorldPosition(to);
        const dir = to.clone().sub(from).normalize();
        arrowRef.current.lookAt(to);
    });

    return (
        <mesh ref={arrowRef} position={[0, 0, 0.1]}>
            <coneGeometry args={[0.05, 0.2, 16]} />
            <meshBasicMaterial color="white" />
        </mesh>
    );
}

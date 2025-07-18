'use client';

import { forwardRef } from 'react';
import { Text } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';


interface MarkerProps {
    position: Vector3;
    color: string;
    label: string;
}

const Marker = forwardRef<THREE.Object3D, MarkerProps>(({ position, color, label }, ref) => (
    <group ref={ref} position={position}>
        <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={color} />
        </mesh>
        <Text
            position={[0.1, 0.1, 0]}
            fontSize={0.1}
            color={color}
            anchorX="left"
            anchorY="bottom"
        >
            {label}
        </Text>
    </group>
));

export default Marker;

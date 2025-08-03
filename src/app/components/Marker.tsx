'use client'

import { useRef, useEffect } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Object3D } from 'three'

type MarkerProps = {
    label: string
    position: THREE.Vector3
    color?: string
}

export default function Marker({
    label,
    position,
    color = 'white',
}: MarkerProps) {
    const ref = useRef<Object3D>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.lookAt(new THREE.Vector3(0, 0, 0)) // дивиться в центр сцени
        }
    }, [position])

    return (
        <group ref={ref} position={position}>
            <mesh>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text
                position={[0, 0.15, 0]}
                fontSize={0.1}
                color={color}
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    )
}

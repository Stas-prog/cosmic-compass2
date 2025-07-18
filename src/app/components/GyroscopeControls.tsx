import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';


export default function GyroscopeControls({ objectRef }: { objectRef: React.RefObject<THREE.Object3D> }) {
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (objectRef.current) {
                const { alpha, beta, gamma } = event;
                objectRef.current.rotation.set(
                    THREE.MathUtils.degToRad(beta ?? 0),
                    THREE.MathUtils.degToRad(alpha ?? 0),
                    -THREE.MathUtils.degToRad(gamma ?? 0)
                );
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [objectRef]);

    return null;
}

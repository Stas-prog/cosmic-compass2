'use client'

import { useEffect } from 'react'
import { Object3D } from 'three'
import * as THREE from 'three';


type Props = {
    objectRef: React.RefObject<Object3D>
}

export default function GyroscopeControls({ objectRef }: Props) {
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!event.alpha || !objectRef.current) return

            const alpha = THREE.MathUtils.degToRad(event.alpha)
            const beta = THREE.MathUtils.degToRad(event.beta || 0)
            const gamma = THREE.MathUtils.degToRad(event.gamma || 0)

            const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ')
            objectRef.current.setRotationFromEuler(euler)
        }

        window.addEventListener('deviceorientation', handleOrientation, true)
        return () => window.removeEventListener('deviceorientation', handleOrientation)
    }, [objectRef])

    return null
}

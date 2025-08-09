"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Horizon from "./Horizon";
import Reticle from "./Reticle";

export default function CompassScene() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (cameraRef.current) {
                const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
                const beta = THREE.MathUtils.degToRad(event.beta || 0);
                const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

                const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
                cameraRef.current.quaternion.setFromEuler(euler);
            }
        };

        window.addEventListener("deviceorientation", handleOrientation, true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("GPS:", pos.coords.latitude, pos.coords.longitude);
            },
            (err) => console.warn("GPS error:", err),
            { enableHighAccuracy: true }
        );

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    return (
        <>
            <Canvas>
                <perspectiveCamera ref={cameraRef} position={[0, 0, 0]} fov={75} />
                <Horizon />

                {/* Зоряна сфера */}
                <mesh>
                    <sphereGeometry args={[500, 64, 64]} />
                    <meshBasicMaterial color={0xffffff} wireframe />
                </mesh>
            </Canvas>

            <Reticle />
        </>
    );
}

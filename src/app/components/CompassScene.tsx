"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import Horizon from "./Horizon";
import Reticle from "./Reticle";

import { enableGyroscope } from "../utils/useGyroscope";
import { getSunDirection } from "../utils/sunDirection";
import { createSunMarker } from "../utils/createSunMarker";
import { getEarthOrbitDirection } from "../utils/earthOrbitDirection";
import { snapIfClose } from "../utils/snapToTarget";

function SceneCore() {
    const { camera, scene } = useThree();

    const sunRef = useRef<THREE.Object3D | null>(null);
    const sunDirRef = useRef<THREE.Vector3 | null>(null);

    // === GYROSCOPE ===
    useEffect(() => {
        if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
            enableGyroscope(camera as THREE.PerspectiveCamera);
        }
    }, [camera]);


    // === GPS + ASTRONOMY ===
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;

                // ☀️ SUN
                const sunDir = getSunDirection(latitude, longitude);
                sunDirRef.current = sunDir;

                const sun = createSunMarker(sunDir);
                sunRef.current = sun;
                scene.add(sun);

                // 🌍 EARTH ORBIT DIRECTION
                const orbitDir = getEarthOrbitDirection(sunDir);
                const orbitArrow = new THREE.ArrowHelper(
                    orbitDir,
                    new THREE.Vector3(0, 0, 0),
                    200,
                    0x00ffcc
                );
                scene.add(orbitArrow);
            },
            (err) => console.warn("GPS error:", err),
            { enableHighAccuracy: true }
        );
    }, [scene]);

    // === SNAP TO SUN ===
    useFrame(() => {
        if (!sunRef.current || !sunDirRef.current) return;

        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);

        if (snapIfClose(camDir, sunDirRef.current, 2)) {
            camera.lookAt(sunRef.current.position);
        }
    });

    return (
        <>
            <Horizon />

            {/* 🌌 STAR SKY */}
            <mesh>
                <sphereGeometry args={[500, 64, 64]} />
                <meshBasicMaterial
                    map={new THREE.TextureLoader().load("/textures/stars.png")}
                    side={THREE.BackSide}
                />
            </mesh>
        </>
    );
}

export default function CompassScene() {
    return (
        <>
            <Canvas>
                <perspectiveCamera position={[0, 0, 0]} fov={75} />
                <SceneCore />
            </Canvas>
            <Reticle />
        </>
    );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import Horizon from "./Horizon";
import Reticle from "./Reticle";
import { TextureLoader } from "three";

export default function CompassScene() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const [started, setStarted] = useState(false);

    const startCompass = async () => {
        // iOS вимагає явний дозвіл
        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof (DeviceOrientationEvent as any).requestPermission === "function"
        ) {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            if (permission !== "granted") {
                alert("Доступ до гіроскопа заборонено");
                return;
            }
        }

        // Гіроскоп
        window.addEventListener(
            "deviceorientation",
            (event: DeviceOrientationEvent) => {
                if (cameraRef.current) {
                    const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
                    const beta = THREE.MathUtils.degToRad(event.beta || 0);
                    const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

                    const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
                    cameraRef.current.quaternion.setFromEuler(euler);
                }
            },
            true
        );

        // GPS
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("GPS:", pos.coords.latitude, pos.coords.longitude);
            },
            (err) => console.warn("GPS error:", err),
            { enableHighAccuracy: true }
        );

        setStarted(true);
    };

    // Завантаження текстури зоряного неба
    const starsTexture = new TextureLoader().load("/textures/stars.jpg");

    return (
        <>
            {!started && (
                <button
                    onClick={startCompass}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px 40px",
                        fontSize: "18px",
                        zIndex: 20
                    }}
                >
                    Почати
                </button>
            )}

            <Canvas>
                <perspectiveCamera ref={cameraRef} position={[0, 0, 0]} fov={75} />
                <Horizon />

                {/* Сфера зоряного неба */}
                <mesh>
                    <sphereGeometry args={[500, 64, 64]} />
                    <meshBasicMaterial
                        map={starsTexture}
                        side={THREE.BackSide}
                    />
                </mesh>
            </Canvas>

            <Reticle />
        </>
    );
}

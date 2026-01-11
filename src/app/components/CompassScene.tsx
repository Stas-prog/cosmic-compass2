"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import Horizon from "./Horizon";
import Reticle from "./Reticle";
import { TextureLoader } from "three";

// Константи для орбітальних розрахунків
const EARTH_ORBIT_RADIUS = 149_600_000; // км, спрощено
const SOLAR_SYSTEM_VECTOR = new THREE.Vector3(1, 0, 0).normalize(); // напрямок руху Сонячної системи

export default function CompassScene() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const [started, setStarted] = useState(false);
    const [starsTexture, setStarsTexture] = useState<THREE.Texture | null>(null);

    // Завантаження текстури зоряного неба
    useEffect(() => {
        const loader = new TextureLoader();
        loader.load("/textures/stars.png", (texture) => {
            setStarsTexture(texture);
        });
    }, []);

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
        if (typeof window !== "undefined") {
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
        }

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

    // Маркери для Сонця, Землі та Сонячної системи
    const sunRef = useRef<THREE.Mesh>(null);
    const earthRef = useRef<THREE.Mesh>(null);
    const solarSystemRef = useRef<THREE.Mesh>(null);

    // Оновлення позицій маркерів кожні 10 хвилин (600000 мс)
    useEffect(() => {
        const updateMarkers = () => {
            // Тут можна підставити реальні обчислення через астрономічні формули
            const now = new Date().getTime() / 1000; // секунда від епохи

            // Сонце – спрощено, завжди на векторі вперед
            if (sunRef.current) {
                sunRef.current.position.set(0, 0, -100);
            }

            // Земля – обертання навколо Сонця
            if (earthRef.current) {
                const angle = (now / 86400) * (2 * Math.PI) / 365; // оберт за рік
                earthRef.current.position.set(
                    EARTH_ORBIT_RADIUS * Math.cos(angle) / 1e6,
                    0,
                    EARTH_ORBIT_RADIUS * Math.sin(angle) / 1e6
                );
            }

            // Сонячна система – фіксований вектор
            if (solarSystemRef.current) {
                solarSystemRef.current.position.copy(SOLAR_SYSTEM_VECTOR.clone().multiplyScalar(50));
            }
        };

        updateMarkers();
        const interval = setInterval(updateMarkers, 600_000);
        return () => clearInterval(interval);
    }, []);

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
                {starsTexture && (
                    <mesh>
                        <sphereGeometry args={[500, 64, 64]} />
                        <meshBasicMaterial map={starsTexture} side={THREE.BackSide} />
                    </mesh>
                )}

                {/* Маркери */}
                <mesh ref={sunRef}>
                    <sphereGeometry args={[2, 16, 16]} />
                    <meshBasicMaterial color="yellow" />
                </mesh>

                <mesh ref={earthRef}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial color="red" />
                </mesh>

                <mesh ref={solarSystemRef}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial color="green" />
                </mesh>
            </Canvas>

            <Reticle />
        </>
    );
}

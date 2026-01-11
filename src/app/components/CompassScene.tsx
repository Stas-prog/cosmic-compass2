"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Reticle from "./Reticle";
import { enableGyroscope } from "../utils/useGyroscope";
import { getSunDirection } from "../utils/sunDirection";
import { createSunMarker } from "../utils/createSunMarker";

export default function CompassScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const startGyroRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // === SCENE ===
        const scene = new THREE.Scene();

        // === CAMERA ===
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 0);

        // === RENDERER ===
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        // === STARS BACKGROUND ===
        const starsGeometry = new THREE.SphereGeometry(500, 64, 64);
        const starsMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide,
        });
        const stars = new THREE.Mesh(starsGeometry, starsMaterial);
        scene.add(stars);

        // === SUN MARKER ===
        const sunDir = getSunDirection(); // Vector3
        const sun = createSunMarker(sunDir);
        scene.add(sun);

        // === GYROSCOPE ===
        startGyroRef.current = enableGyroscope(camera);

        // === RESIZE ===
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        // === ANIMATE ===
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // === CLEANUP ===
        return () => {
            window.removeEventListener("resize", onResize);
            sun.geometry.dispose();
            (sun.material as THREE.Material).dispose();
            stars.geometry.dispose();
            (stars.material as THREE.Material).dispose();
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
            <Reticle />
            <button
                onClick={() => startGyroRef.current?.()}
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                }}
            >
                Enable motion
            </button>
        </div>
    );
}

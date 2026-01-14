"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// utils
import { enableGyroscope } from "../utils/gyro";
import { createStarSphere } from "../utils/stars";
import { projectToHud } from "../utils/projectToHud";
import { createMarker } from "../utils/markers";
import { getSunDirection } from "../utils/sun";
import { getEarthOrbitDirection } from "../utils/earthOrbit";
import { getSolarSystemMotionDirection } from "../utils/solarSystemMotion";
import { isSnapped } from "../utils/snap";
import { startAstroTimer } from "../utils/astroTimer";
import { vectorToAzAlt } from "../utils/vectorToAzAlt";
import { worldToCamera } from "../utils/worldToCamera";
import { projectToScreen } from "../utils/projectToScreen";
import { isInsideViewport } from "../utils/isInsideViewport";
import { getArrowDirection } from "../utils/getArrowDirection";



type Props = {
    onCoords?: (azimuth: number, altitude: number) => void;
    onSunArrow?: (angle: number | null) => void;
};


export default function CompassScene({ onCoords, onSunArrow }: Props) {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        /* =======================
           SCENE
        ======================= */
        const scene = new THREE.Scene();

        /* =======================
           CAMERA
        ======================= */
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        camera.position.set(0, 0, 0.1);

        /* =======================
           RENDERER
        ======================= */
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        /* =======================
           GYROSCOPE
        ======================= */
        const stopGyro = enableGyroscope(camera);

        /* =======================
           STARS (BIG SPHERE)
        ======================= */
        const stars = createStarSphere("/textures/stars.png");
        scene.add(stars);

        /* =======================
           HUD GROUP (SMALL SPHERE)
        ======================= */
        const HUD_RADIUS = 3;
        const hudGroup = new THREE.Group();
        hudGroup.position.set(0, 0, -3);

        camera.add(hudGroup);
        scene.add(camera);

        /* =======================
           MARKERS
        ======================= */
        const sunMarker = createMarker({
            color: 0xffcc00,
            size: 0.4,
            name: "sun",
        });

        const earthOrbitMarker = createMarker({
            color: 0x00ffcc,
            size: 0.3,
            name: "earthOrbit",
        });

        const solarSystemMarker = createMarker({
            color: 0xff66ff,
            size: 0.35,
            name: "solarSystem",
        });

        hudGroup.add(sunMarker, earthOrbitMarker, solarSystemMarker);


        /* =======================
           DIRECTIONS
        ======================= */
        let sunDir = new THREE.Vector3();
        let earthOrbitDir = new THREE.Vector3();
        let solarSystemDir = getSolarSystemMotionDirection();

        /* =======================
           GEO + ASTRO TIMER
        ======================= */
        let stopAstroTimer: (() => void) | null = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;

                    stopAstroTimer = startAstroTimer(() => {
                        sunDir = getSunDirection(latitude, longitude);
                        earthOrbitDir = getEarthOrbitDirection(sunDir);

                        sunMarker.position.copy(
                            projectToHud(sunDir, HUD_RADIUS)
                        );

                        earthOrbitMarker.position.copy(
                            projectToHud(earthOrbitDir, HUD_RADIUS)
                        );

                        solarSystemMarker.position.copy(
                            projectToHud(solarSystemDir, HUD_RADIUS)
                        );
                    });
                },
                (err) => {
                    console.warn("Geolocation error:", err);
                },
                { enableHighAccuracy: true }
            );
        }

        // sunMarker.position.copy(projectToHud(sunDir, HUD_RADIUS));
        sunMarker.position.set(1, 0, 0);


        /* =======================
           ANIMATION LOOP
        ======================= */
        const viewDir = new THREE.Vector3();

        const animate = () => {
            requestAnimationFrame(animate);

            camera.getWorldDirection(viewDir);

            const { azimuth, altitude } = vectorToAzAlt(viewDir);
            onCoords?.(azimuth, altitude);

            const viewport = { width: window.innerWidth, height: window.innerHeight };

            const sunCamDir = worldToCamera(sunDir, camera);
            const screenPos = projectToScreen(sunCamDir, camera, viewport);

            let arrowAngle: number | null = null;

            if (!isInsideViewport(screenPos, viewport)) {
                arrowAngle = getArrowDirection(screenPos, viewport);
            }

            // тут прокидаєш arrowAngle в state / callback
            onSunArrow?.(arrowAngle);

            // Тимчасовий дебаг:
            console.log("Sun screen:", screenPos);

            // hudGroup.rotation.y += 0.001;

            // SNAP: Sun example
            // if (sunDir.lengthSq() > 0) {
            //     const snapped = isSnapped(camDir, sunDir, 2);
            //     (sunMarker.material as THREE.MeshBasicMaterial).color.set(
            //         snapped ? 0xffaa00 : 0xffcc00
            //     );
            // }

            if (sunDir.lengthSq() > 0) {
                sunMarker.position.copy(
                    projectToHud(sunDir, HUD_RADIUS)
                );
            }

            if (earthOrbitDir.lengthSq() > 0) {
                earthOrbitMarker.position.copy(
                    projectToHud(earthOrbitDir, HUD_RADIUS)
                );
            }

            solarSystemMarker.position.copy(
                projectToHud(solarSystemDir, HUD_RADIUS)
            );

            renderer.render(scene, camera);
        };

        animate();

        /* =======================
           RESIZE
        ======================= */
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        /* =======================
           CLEANUP
        ======================= */
        return () => {
            window.removeEventListener("resize", onResize);
            stopGyro?.();
            stopAstroTimer?.();
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
            }}
        />
    );
}


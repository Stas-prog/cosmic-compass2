"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.load(
      "/A_high-resolution_digital_photograph_of_a_star-fil.png",
      (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const skySphere = new THREE.Mesh(geometry, material);
        scene.add(skySphere);

        setLoaded(true);

        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();

        // Гіроскоп
        const handleOrientation = (event: DeviceOrientationEvent) => {
          const alpha = (event.alpha ?? 0) * (Math.PI / 180);
          const beta = (event.beta ?? 0) * (Math.PI / 180);
          const gamma = (event.gamma ?? 0) * (Math.PI / 180);

          const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
          camera.quaternion.setFromEuler(euler);
        };

        window.addEventListener("deviceorientation", handleOrientation, true);
      },
      undefined,
      (err) => {
        console.error("Помилка завантаження текстури:", err);
      }
    );

    return () => {
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
      {/* Приціл */}
      {loaded && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
            border: "2px solid white",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 10,
          }}
        ></div>
      )}
    </div>
  );
}

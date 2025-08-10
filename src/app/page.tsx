"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [granted, setGranted] = useState(false);
  const [angles, setAngles] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    cameraRef.current = camera;

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
      }
    );

    return () => {
      renderer.dispose();
    };
  }, []);

  const enableCompass = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      (DeviceOrientationEvent as any).requestPermission
    ) {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission !== "granted") return;
    }
    setGranted(true);

    window.addEventListener("deviceorientation", (event) => {
      if (!cameraRef.current) return;
      const alpha = event.alpha ?? 0;
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      setAngles({ alpha, beta, gamma });

      const euler = new THREE.Euler(
        beta * (Math.PI / 180),
        alpha * (Math.PI / 180),
        -gamma * (Math.PI / 180),
        "YXZ"
      );
      cameraRef.current.quaternion.setFromEuler(euler);
    });
  };

  return (
    <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}>
      {loaded && !granted && (
        <button
          onClick={enableCompass}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          Увімкнути компас
        </button>
      )}

      {loaded && granted && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "14px",
            zIndex: 10,
          }}
        >
          α: {angles.alpha.toFixed(1)}°<br />
          β: {angles.beta.toFixed(1)}°<br />
          γ: {angles.gamma.toFixed(1)}°
        </div>
      )}

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

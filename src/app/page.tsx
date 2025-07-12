"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function CosmicCompass() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Зоряне небо (сфера навколо камери)
    const starGeo = new THREE.SphereGeometry(100, 64, 64);
    const starMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("/starfield.jpg"),
      side: THREE.BackSide,
    });
    const starField = new THREE.Mesh(starGeo, starMat);
    scene.add(starField);

    // Стрілка напряму руху Сонячної системи (вгору, приблизно в напрямку сузір'я Геркулеса)
    const arrowSS = new THREE.ArrowHelper(
      new THREE.Vector3(0.2, 1, 0).normalize(), // напрямок
      new THREE.Vector3(0, 0, 0),              // початок
      2,
      0xff6600
    );
    scene.add(arrowSS);

    // Стрілка напряму руху Землі по орбіті (перпендикуляр до вектора до Сонця)
    const arrowEarth = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      2,
      0x00ff00
    );
    scene.add(arrowEarth);

    // Орієнтація телефону
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const alpha = e.alpha ?? 0;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;

      const rotation = new THREE.Euler(
        THREE.MathUtils.degToRad(beta),
        THREE.MathUtils.degToRad(alpha),
        -THREE.MathUtils.degToRad(gamma),
        "YXZ"
      );
      camera.quaternion.setFromEuler(rotation);
    };

    if (typeof DeviceOrientationEvent !== "undefined") {
      if ((DeviceOrientationEvent as any).requestPermission) {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((response: string) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    }

    // Геолокація
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="w-screen h-screen relative">
      {coords && (
        <div className="absolute top-2 left-2 text-white bg-black/60 p-2 rounded text-sm font-mono z-10">
          <div>🌍 Широта: {coords.lat.toFixed(4)}</div>
          <div>🌐 Довгота: {coords.lon.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
}


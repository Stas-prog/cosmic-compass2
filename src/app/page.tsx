// src/app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Освітлення
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffcc66, 2, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Сонце
    const sunGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Земля
    const earthGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2266ff });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Орбіта
    const orbitCurve = new THREE.EllipseCurve(0, 0, 6, 6, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
      orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // Зоряне небо
    const starTexture = new THREE.TextureLoader().load("/starfield.jpg");
    const starSphere = new THREE.Mesh(
      new THREE.SphereGeometry(100, 64, 64),
      new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide })
    );
    scene.add(starSphere);

    // Стрілка напрямку руху Землі навколо Сонця
    const earthArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      earth.position,
      2,
      0x00ff00
    );
    scene.add(earthArrow);

    // Стрілка руху Сонячної системи
    const solarSystemDirection = new THREE.Vector3(1, 0, 0).normalize();
    const solarArrow = new THREE.ArrowHelper(
      solarSystemDirection,
      new THREE.Vector3(0, 0, 0),
      4,
      0xff0000
    );
    scene.add(solarArrow);

    // Компас-стрілка користувача
    const userArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0),
      3,
      0x00ffff
    );
    scene.add(userArrow);

    // Швидкості
    const earthSpeed = 29.78; // км/с
    const solarSystemSpeed = 230; // км/с

    const animate = () => {
      requestAnimationFrame(animate);

      // Обертання Землі навколо Сонця
      const time = Date.now() * 0.0001;
      const angle = time % (2 * Math.PI);
      const x = 6 * Math.cos(angle);
      const y = 6 * Math.sin(angle);
      earth.position.set(x, y, 0);

      // Оновлення напрямку обертання
      const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0).normalize();
      earthArrow.setDirection(tangent);
      earthArrow.position.copy(earth.position);

      renderer.render(scene, camera);
    };

    animate();

    // Гіроскоп
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ?? 0;
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(beta),
        THREE.MathUtils.degToRad(alpha),
        THREE.MathUtils.degToRad(-gamma),
        "YXZ"
      );

      const dir = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();
      userArrow.setDirection(dir);
    };

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      (DeviceOrientationEvent as any).requestPermission
    ) {
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

    // Геолокація
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      });
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute top-2 left-2 text-white text-sm bg-black/60 px-2 py-1 rounded">
        🌍 Earth: {29.78} km/s <br />
        🌌 Solar System: {230} km/s
        <br />
        {coords && (
          <>
            📍Lat: {coords.lat.toFixed(4)} <br />
            📍Lon: {coords.lon.toFixed(4)}
          </>
        )}
      </div>
    </div>
  );
}

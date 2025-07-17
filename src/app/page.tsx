'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import GyroscopeControls from './utils/GyroscopeControls';
import SunCalc from 'suncalc'; // переконайся, що встановлений (npm install suncalc)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<'sun' | 'orbit' | 'system' | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Приціл
    const cross = new THREE.RingGeometry(0.005, 0.01, 32);
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const crossMesh = new THREE.Mesh(cross, crossMat);
    crossMesh.position.z = -0.05;
    camera.add(crossMesh);
    scene.add(camera);

    // Контролер гіроскопа
    const controls = new GyroscopeControls(camera);
    controls.connect();

    // Маркери
    const markerGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const markers: Record<string, THREE.Mesh> = {
      sun: new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xffff00 })),
      orbit: new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 })),
      system: new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 })),
    };
    Object.values(markers).forEach(m => scene.add(m));

    // Лінії-наведення
    const guideLines: Record<string, THREE.Line> = {};
    Object.keys(markers).forEach(key => {
      const material = new THREE.LineBasicMaterial({ color: Number((markers as any)[key].material.color.getHex()), transparent: true, opacity: 0.5 });
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geo, material);
      line.visible = false;
      scene.add(line);
      guideLines[key] = line;
    });

    const updateMarkerPositions = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        const now = new Date();

        // Сонце
        const sunPos = SunCalc.getPosition(now, latitude, longitude);
        const az = sunPos.azimuth; // радіани
        const alt = sunPos.altitude;
        const r = 1;
        const sx = r * Math.cos(alt) * Math.sin(az);
        const sy = r * Math.sin(alt);
        const sz = r * Math.cos(alt) * Math.cos(az);
        markers.sun.position.set(sx, sy, sz);

        // Орбіта Землі — дотична (приблизно на екліптиці, по довготі Сонця)
        const eclLon = az + Math.PI / 2;
        const ex = r * Math.cos(0) * Math.sin(eclLon);
        const ey = 0;
        const ez = r * Math.cos(0) * Math.cos(eclLon);
        markers.orbit.position.set(ex, ey, ez);

        // Напрям руху Сонячної системи — до Веги (RA≈18h36m / Dec≈+38°47′)
        const ra = (18 + 36 / 60) * 15 * Math.PI / 180;
        const dec = (38 + 47 / 60) * Math.PI / 180;
        const vx = Math.cos(dec) * Math.cos(ra);
        const vy = Math.sin(dec);
        const vz = Math.cos(dec) * Math.sin(ra);
        markers.system.position.set(vx, vy, vz);
      }, err => console.error(err));
    };

    updateMarkerPositions();
    const interval = setInterval(updateMarkerPositions, 10 * 60 * 1000); // кожні 10 хв

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Оновлення напрямків і ліній
      Object.entries(markers).forEach(([key, m]) => {
        const line = guideLines[key];
        const p = m.position.clone().normalize().multiplyScalar(0.9);
        if (selected === key) {
          line.visible = true;
          const pts = [new THREE.Vector3(), p];
          line.geometry.setFromPoints(pts);
        } else {
          line.visible = false;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      clearInterval(interval);
      controls.disconnect();
      window.removeEventListener('resize', () => { });
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [selected]);

  return (
    <div ref={containerRef} className="w-screen h-screen relative">
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-10">
        {['sun', 'orbit', 'system'].map(k => (
          <button key={k}
            className={`px-4 py-2 rounded text-white font-bold ${selected === k ? `bg-${k === 'sun' ? 'yellow' : k === 'orbit' ? 'green' : 'red'}-500 ring-4` : 'bg-gray-800'
              }`}
            onClick={() => setSelected(k as any)}
          >
            {k === 'sun' ? 'Сонце' : k === 'orbit' ? 'Орбіта' : 'Сонячна система'}
          </button>
        ))}
      </div>
    </div>
  );
}

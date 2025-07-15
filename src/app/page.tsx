'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import GyroscopeControls from './utils/GyroscopeControls';

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'sun' | 'orbit' | 'system' | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const materials = {
      sun: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
      orbit: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      system: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    };

    const markers = {
      sun: new THREE.Mesh(geometry, materials.sun),
      orbit: new THREE.Mesh(geometry, materials.orbit),
      system: new THREE.Mesh(geometry, materials.system),
    };

    markers.sun.position.set(5, 0, 0);
    markers.orbit.position.set(0, 5, 0);
    markers.system.position.set(0, 0, -5);

    scene.add(markers.sun, markers.orbit, markers.system);

    const controls = new GyroscopeControls(camera);
    controls.connect();

    camera.position.z = 1;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      controls.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-10">
        <button
          className={selectedDirection === 'sun' ? 'bg-yellow-300 px-4 py-2' : 'bg-gray-800 text-white px-4 py-2'}
          onClick={() => setSelectedDirection('sun')}
        >
          Сонце
        </button>
        <button
          className={selectedDirection === 'orbit' ? 'bg-green-300 px-4 py-2' : 'bg-gray-800 text-white px-4 py-2'}
          onClick={() => setSelectedDirection('orbit')}
        >
          Орбіта Землі
        </button>
        <button
          className={selectedDirection === 'system' ? 'bg-red-300 px-4 py-2' : 'bg-gray-800 text-white px-4 py-2'}
          onClick={() => setSelectedDirection('system')}
        >
          Сонячна система
        </button>
      </div>
    </div>
  );
}

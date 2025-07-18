'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import GyroscopeControls from './components/GyroscopeControls';
import { Vector3 } from 'three';
import Marker from './components/Marker';
import ArrowToTarget from './components/ArrowToTarget';
import * as THREE from 'three';

export default function Page() {
  const [activeTarget, setActiveTarget] = useState<'sun' | 'orbit' | 'galactic' | null>(null);

  const sunRef = useRef<THREE.Object3D>(null!);
  const orbitRef = useRef<THREE.Object3D>(null!);
  const galacticRef = useRef<THREE.Object3D>(null!);
  const cameraRef = useRef<THREE.Object3D>(null!);

  const targets: Record<string, React.RefObject<THREE.Object3D>> = {
    sun: sunRef,
    orbit: orbitRef,
    galactic: galacticRef,
  };

  return (
    <main className="h-screen w-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight />
        <Suspense fallback={null}>
          <GyroscopeControls objectRef={cameraRef} />

          {/* Приціл */}
          <mesh position={[0, 0, -1]}>
            <ringGeometry args={[0.02, 0.03, 32]} />
            <meshBasicMaterial color="white" side={2} />
          </mesh>

          {/* Сонце */}
          <Marker ref={sunRef} position={new THREE.Vector3(2, 1, -5)} color="yellow" label="Sun" />

          {/* Напрям орбіти Землі */}
          <Marker ref={orbitRef} position={new THREE.Vector3(-3, 0, -4)} color="blue" label="Orbit" />

          {/* Напрям руху Сонячної системи */}
          <Marker ref={galacticRef} position={new THREE.Vector3(1, -2, -6)} color="magenta" label="Galactic" />

          {/* Стрілка до активної цілі */}
          {activeTarget && targets[activeTarget]?.current && (
            <ArrowToTarget target={targets[activeTarget]} />
          )}

          {/* Додатково для десктопів */}
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>

      {/* Кнопки вибору напрямку */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2">
        <button
          onClick={() => setActiveTarget('sun')}
          className={`px-4 py-2 rounded ${activeTarget === 'sun' ? 'bg-yellow-500' : 'bg-gray-800 text-white'}`}
        >
          Сонце
        </button>
        <button
          onClick={() => setActiveTarget('orbit')}
          className={`px-4 py-2 rounded ${activeTarget === 'orbit' ? 'bg-blue-500' : 'bg-gray-800 text-white'}`}
        >
          Орбіта
        </button>
        <button
          onClick={() => setActiveTarget('galactic')}
          className={`px-4 py-2 rounded ${activeTarget === 'galactic' ? 'bg-pink-500' : 'bg-gray-800 text-white'}`}
        >
          Галактика
        </button>
      </div>
    </main>
  );
}

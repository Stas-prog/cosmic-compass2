'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import GyroscopeControls from './utils/GyroscopeControls';
import * as THREE from 'three';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
// import helvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json'




type MarkerType = 'sun' | 'orbit' | 'system';

const markerData: Record<MarkerType, { color: string; label: string; position: [number, number, number] }> = {
  sun: {
    color: 'yellow',
    label: 'Сонце',
    position: [10, 2, 0],
  },
  orbit: {
    color: 'cyan',
    label: 'Орбіта',
    position: [0, 0, -10],
  },
  system: {
    color: 'red',
    label: 'Сонячна система',
    position: [-8, 1, 2],
  },
};

function Marker({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <textGeometry args={[label, { size: 0.3, height: 0.05 }]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function LineToTarget({ target }: { target: THREE.Vector3 }) {
  const ref = useRef<THREE.Line>(null);

  useEffect(() => {
    if (ref.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        target.clone().normalize().multiplyScalar(2),
      ]);
      ref.current.geometry.dispose();
      ref.current.geometry = geometry;
    }
  }, [target]);

  return (
    <lineSegments ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="white" linewidth={2} />
    </lineSegments>
  );
}

function Scene({ activeTarget }: { activeTarget: MarkerType | null }) {
  const groupRef = useRef<THREE.Group>(null!);

  const markerRefs = useMemo(() => {
    const refs: Record<MarkerType, THREE.Vector3> = {
      sun: new THREE.Vector3(...markerData.sun.position),
      orbit: new THREE.Vector3(...markerData.orbit.position),
      system: new THREE.Vector3(...markerData.system.position),
    };
    return refs;
  }, []);

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <GyroscopeControls objectRef={groupRef} />

      {/** Центр-приціл */}
      <mesh>
        <ringGeometry args={[0.05, 0.08, 32]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      {/** Всі мітки */}
      {Object.entries(markerData).map(([key, { color, label, position }]) => (
        <Marker key={key} color={color} label={label} position={position} />
      ))}

      {/** Допоміжна лінія до активної цілі */}
      {activeTarget && <LineToTarget target={markerRefs[activeTarget]} />}
    </group>
  );
}

export default function Page() {
  const [activeTarget, setActiveTarget] = useState<MarkerType | null>(null);

  return (
    <div className="w-screen h-screen bg-black">
      <Canvas>
        <Suspense fallback={null}>
          <Scene activeTarget={activeTarget} />
        </Suspense>
      </Canvas>

      {/** Панель кнопок */}
      <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-50">
        {(Object.keys(markerData) as MarkerType[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTarget((prev) => (prev === key ? null : key))}
            className={`px-3 py-2 rounded text-sm font-bold ${activeTarget === key ? 'bg-white text-black' : 'bg-gray-800 text-white'
              }`}
          >
            {markerData[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Marker from './components/Marker'
import GyroscopeControls from './components/GyroscopeControls'

type MarkerType = 'sun' | 'orbit' | 'system'

const markerData: Record<MarkerType, { color: string; label: string; position: THREE.Vector3 }> = {
  sun: {
    color: 'yellow',
    label: 'Сонце',
    position: new THREE.Vector3(10, 2, 0),
  },
  orbit: {
    color: 'cyan',
    label: 'Орбіта',
    position: new THREE.Vector3(0, 0, -10),
  },
  system: {
    color: 'red',
    label: 'Сонячна система',
    position: new THREE.Vector3(-8, 1, 2),
  },
}

function LineToTarget({ target }: { target: THREE.Vector3 }) {
  const ref = useRef<THREE.Line>(null)

  useEffect(() => {
    if (ref.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        target.clone().normalize().multiplyScalar(2),
      ])
      ref.current.geometry.dispose()
      ref.current.geometry = geometry
    }
  }, [target])

  return (
    <lineSegments ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="white" linewidth={2} />
    </lineSegments>
  )
}

function Scene({
  activeTarget,
  permissionGranted,
}: {
  activeTarget: MarkerType | null
  permissionGranted: boolean
}) {
  const groupRef = useRef<THREE.Object3D>(null!)

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      {permissionGranted && <GyroscopeControls objectRef={groupRef} />}
      <OrbitControls enableZoom={false} />

      {/* Центр-приціл */}
      <mesh>
        <ringGeometry args={[0.05, 0.08, 32]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      {/* Мітки */}
      {Object.entries(markerData).map(([key, { position, color, label }]) => (
        <Marker key={key} position={position} color={color} label={label} />
      ))}

      {/* Лінія до цілі */}
      {activeTarget && <LineToTarget target={markerData[activeTarget].position} />}
    </group>
  )
}

export default function Page() {
  const [activeTarget, setActiveTarget] = useState<MarkerType | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const requestPermission = async () => {
    const deviceOrientation = DeviceOrientationEvent as any;

    if (
      typeof deviceOrientation !== 'undefined' &&
      typeof deviceOrientation.requestPermission === 'function'
    ) {
      try {
        const response = await deviceOrientation.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          console.log('✅ Дозвіл на гіроскоп надано');
        } else {
          console.warn('❌ Дозвіл відхилено');
        }
      } catch (error) {
        console.error('Помилка при запиті дозволу на гіроскоп:', error);
      }
    } else {
      // Android або інші браузери
      setPermissionGranted(true);
    }
  }


  return (
    <div className="w-screen h-screen bg-black relative">
      <Canvas>
        <Suspense fallback={null}>
          <Scene activeTarget={activeTarget} permissionGranted={permissionGranted} />
        </Suspense>
      </Canvas>

      {/* Кнопка запиту дозволу */}
      {!permissionGranted && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-yellow-400 text-black font-bold rounded shadow"
          >
            Увімкнути гіроскоп
          </button>
        </div>
      )}

      {/* Кнопки вибору напрямків */}
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
  )
}

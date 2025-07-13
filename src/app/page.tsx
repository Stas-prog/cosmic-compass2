'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Завантаження зоряного неба
    new THREE.TextureLoader().load('/sky.jpg', (texture) => {
      const geometry = new THREE.SphereGeometry(500, 64, 64);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });

    // Додамо точку напрямку руху Землі по орбіті (зелена)
    const orbitDir = new THREE.Vector3(1, 0, 0).normalize();
    const greenDot = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 'green' })
    );
    greenDot.position.copy(orbitDir.clone().multiplyScalar(20));
    scene.add(greenDot);

    // Додамо точку напрямку руху Сонячної системи (червона)
    const systemDir = new THREE.Vector3(0, 0, -1).normalize();
    const redDot = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );
    redDot.position.copy(systemDir.clone().multiplyScalar(20));
    scene.add(redDot);

    // Приціл
    const crosshair = document.createElement('div');
    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.width = '20px';
    crosshair.style.height = '20px';
    crosshair.style.border = '2px solid white';
    crosshair.style.borderRadius = '50%';
    crosshair.style.pointerEvents = 'none';
    crosshair.style.zIndex = '10';
    mountRef.current.appendChild(crosshair);

    // Швидкості
    const speedLabel = document.createElement('div');
    speedLabel.style.position = 'absolute';
    speedLabel.style.bottom = '10px';
    speedLabel.style.left = '10px';
    speedLabel.style.color = 'white';
    speedLabel.style.fontSize = '14px';
    speedLabel.style.fontFamily = 'monospace';
    speedLabel.style.zIndex = '10';
    speedLabel.innerHTML = `
      🌍 Земля: 29,783 км/с<br>
      ☀️ Сонячна система: ~828,000 км/год
    `;
    mountRef.current.appendChild(speedLabel);

    // Гіроскоп
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      if (alpha == null || beta == null || gamma == null) return;

      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(beta),
        THREE.MathUtils.degToRad(alpha),
        -THREE.MathUtils.degToRad(gamma),
        'YXZ'
      );
      camera.quaternion.setFromEuler(euler);
    };

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((res: string) => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    // Координати
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });

    // Анімація
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Адаптація до вікна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        mountRef.current.removeChild(crosshair);
        mountRef.current.removeChild(speedLabel);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'black',
      }}
    >
      {coords && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            fontSize: '14px',
            fontFamily: 'monospace',
            zIndex: 10,
          }}
        >
          📍 Lat: {coords.lat.toFixed(4)}<br />
          📍 Lon: {coords.lon.toFixed(4)}
        </div>
      )}
    </div>
  );
}

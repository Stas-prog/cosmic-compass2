"use client";
import { useEffect } from "react";
import * as THREE from "three";

export default function Home() {
  useEffect(() => {
    // Сцена
    const scene = new THREE.Scene();

    // Камера
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Завантажуємо текстуру зірок
    const loader = new THREE.TextureLoader();
    loader.load(
      "/textures/stars.png",
      (texture) => {
        scene.background = texture;

        // Сфера навколо камери
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      undefined,
      (err) => {
        console.error("❌ Помилка завантаження текстури:", err);
      }
    );

    // Рендер цикл
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Розмір вікна
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
}

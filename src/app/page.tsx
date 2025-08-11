"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [supported, setSupported] = useState(false);
  const [permissionNeeded, setPermissionNeeded] = useState(false);
  const [alpha, setAlpha] = useState<number | null>(null);
  const [beta, setBeta] = useState<number | null>(null);
  const [gamma, setGamma] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setSupported(true);

      // @ts-ignore
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        setPermissionNeeded(true);
      } else {
        startListening();
      }
    } else {
      setError("DeviceOrientationEvent не підтримується");
    }
  }, []);

  const requestPermission = async () => {
    try {
      // @ts-ignore
      const response = await DeviceOrientationEvent.requestPermission();
      if (response === "granted") {
        startListening();
        setPermissionNeeded(false);
      } else {
        setError("Доступ до гіроскопа відхилено");
      }
    } catch (err) {
      setError("Помилка при запиті дозволу");
    }
  };

  const startListening = () => {
    window.addEventListener("deviceorientation", (event) => {
      setAlpha(event.alpha ?? null);
      setBeta(event.beta ?? null);
      setGamma(event.gamma ?? null);
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Тест гіроскопа</h1>
      {!supported && <p style={{ color: "red" }}>❌ Не підтримується</p>}
      {permissionNeeded && (
        <button onClick={requestPermission}>Запросити дозвіл</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <p>Alpha (обертання навколо Z): {alpha !== null ? alpha.toFixed(2) : "—"}</p>
        <p>Beta (нахил вперед-назад): {beta !== null ? beta.toFixed(2) : "—"}</p>
        <p>Gamma (нахил вліво-вправо): {gamma !== null ? gamma.toFixed(2) : "—"}</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import CompassScene from "./components/CompassScene";
import HudCoords from "./components/HudCoords";
import HudArrow from "./components/HudArrow";
import MiniCompass from "./components/MiniCompass";

export default function Page() {
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [sunArrowAngle, setSunArrowAngle] = useState<number | null>(null);


  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <CompassScene
        onCoords={(az, alt) => {
          setAzimuth(az);
          setAltitude(alt);
        }}
        onSunArrow={(angle) => {
          setSunArrowAngle(angle);
        }}
      />


      <HudCoords azimuth={azimuth} altitude={altitude} />
      <HudArrow angle={sunArrowAngle} />

      <MiniCompass azimuth={azimuth} />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 32,
          height: 32,
          border: "2px solid white",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

    </main>
  );
}

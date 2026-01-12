"use client";

import { useState } from "react";
import CompassScene from "./components/CompassScene";
import HudCoords from "./components/HudCoords";

export default function Page() {
  const [azimuth, setAzimuth] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      <CompassScene
        onCoords={(az, alt) => {
          setAzimuth(az);
          setAltitude(alt);
        }}
      />

      <HudCoords azimuth={azimuth} altitude={altitude} />
    </main>
  );
}

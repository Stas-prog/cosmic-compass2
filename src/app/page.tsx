"use client"

import dynamic from "next/dynamic";

const CompassScene = dynamic(() => import("@/app/components/CompassScene"), {
  ssr: false,
});


export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <CompassScene />
    </main>
  );
}

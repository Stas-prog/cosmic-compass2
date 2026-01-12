"use client";

import { useEffect, useState } from "react";

export default function HudCoords() {
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [alpha, setAlpha] = useState<number | null>(null);
    const [beta, setBeta] = useState<number | null>(null);
    const [gamma, setGamma] = useState<number | null>(null);

    useEffect(() => {
        // GEOLOCATION
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
            });
        }

        // ORIENTATION
        const handler = (e: DeviceOrientationEvent) => {
            setAlpha(e.alpha);
            setBeta(e.beta);
            setGamma(e.gamma);
        };

        window.addEventListener("deviceorientation", handler);
        return () => window.removeEventListener("deviceorientation", handler);
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 20,
                color: "white",
                fontFamily: "monospace",
                fontSize: 12,
                background: "rgba(0,0,0,0.4)",
                padding: "8px 10px",
                borderRadius: 8,
                lineHeight: 1.4,
            }}
        >
            <div>Lat: {lat?.toFixed(4) ?? "—"}</div>
            <div>Lon: {lon?.toFixed(4) ?? "—"}</div>
            <div>α: {alpha?.toFixed(1) ?? "—"}</div>
            <div>β: {beta?.toFixed(1) ?? "—"}</div>
            <div>γ: {gamma?.toFixed(1) ?? "—"}</div>
        </div>
    );
}

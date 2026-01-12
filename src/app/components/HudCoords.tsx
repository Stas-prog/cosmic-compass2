"use client";

type Props = {
    azimuth: number | null;
    altitude: number | null;
};

export default function HudCoords({ azimuth, altitude }: Props) {
    return (
        <div
            style={{
                position: "fixed",
                top: 10,
                left: 10,
                zIndex: 20,
                color: "white",
                fontFamily: "monospace",
                fontSize: 12,
                background: "rgba(0,0,0,0.4)",
                padding: "8px 10px",
                borderRadius: 8,
            }}
        >
            <div>Azimuth: {azimuth?.toFixed(1) ?? "—"}°</div>
            <div>Altitude: {altitude?.toFixed(1) ?? "—"}°</div>
        </div>
    );
}

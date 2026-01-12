"use client";

type Props = {
    yawDeg: number | null; // 0–360
    active?: boolean;     // чи активний snap
};

export default function MiniCompass({ yawDeg, active }: Props) {
    const rotation = yawDeg !== null ? -yawDeg : 0;

    return (
        <div
            style={{
                position: "fixed",
                right: 12,
                top: 12,
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: active
                    ? "2px solid #ffd166"
                    : "2px solid rgba(255,255,255,0.7)",
                background: "rgba(0,0,0,0.4)",
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                boxShadow: active
                    ? "0 0 12px rgba(255,209,102,0.9)"
                    : "none",
                transition: "all 0.15s ease",
            }}
        >
            {/* Dial */}
            <div
                style={{
                    position: "absolute",
                    inset: 6,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.3)",
                }}
            />

            {/* North arrow */}
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: active
                        ? "18px solid #ffd166"
                        : "18px solid #ff4d4d",
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "50% 75%",
                    transition: "border-bottom-color 0.15s ease",
                }}
            />

            {/* Center dot */}
            <div
                style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                }}
            />
        </div>
    );
}

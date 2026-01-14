"use client";

type Props = {
    azimuth: number | null;
};

export default function MiniCompass({ azimuth }: Props) {
    if (azimuth === null) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.4)",
                zIndex: 30,
            }}
        >
            {/* North arrow */}
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: "18px solid red",
                    transform: `rotate(${-azimuth}deg)`,
                    transformOrigin: "50% 80%",
                }}
            />
        </div>
    );
}

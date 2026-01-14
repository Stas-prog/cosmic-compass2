"use client";

type Props = {
    angle: number | null;
};

export default function HudArrow({ angle }: Props) {
    if (angle === null) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "20px solid white",
                transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                transformOrigin: "50% 60px",
                pointerEvents: "none",
                zIndex: 25,
            }}
        />
    );
}

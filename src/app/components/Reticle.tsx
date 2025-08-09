export default function Reticle() {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "40px",
                height: "40px",
                border: "2px solid white",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 10
            }}
        />
    );
}

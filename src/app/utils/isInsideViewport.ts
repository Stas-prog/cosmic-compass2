export function isInsideViewport(
    screenPos: { x: number; y: number; z: number },
    viewport: { width: number; height: number }
) {
    if (screenPos.z < -1 || screenPos.z > 1) return false;

    return (
        screenPos.x >= 0 &&
        screenPos.x <= viewport.width &&
        screenPos.y >= 0 &&
        screenPos.y <= viewport.height
    );
}

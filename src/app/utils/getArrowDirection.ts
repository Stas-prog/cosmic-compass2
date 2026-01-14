export function getArrowDirection(
    screenPos: { x: number; y: number },
    viewport: { width: number; height: number }
) {
    const cx = viewport.width / 2;
    const cy = viewport.height / 2;

    const dx = screenPos.x - cx;
    const dy = screenPos.y - cy;

    // Кут у радіанах, 0 — вправо
    return Math.atan2(dy, dx);
}

import * as THREE from "three";

/**
 * Повертає НАПРЯМОК на Сонце (нормалізований вектор)
 * за широтою, довготою і поточним часом (спрощена NOAA-модель).
 */
export function getSunDirection(
    latDeg: number,
    lonDeg: number,
    date = new Date()
): THREE.Vector3 {
    const rad = Math.PI / 180;

    // Дні від J2000
    const d =
        (Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        ) - Date.UTC(2000, 0, 1)) / 86400000 +
        (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;

    const g = (357.529 + 0.98560028 * d) * rad;
    const q = (280.459 + 0.98564736 * d) * rad;
    const L = q + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;

    const e = 23.439 * rad;
    const dec = Math.asin(Math.sin(e) * Math.sin(L));

    const timeMin =
        date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    const H = ((timeMin / 4 + lonDeg - 180) * rad) % (2 * Math.PI);

    const lat = latDeg * rad;

    // Горизонтальні координати
    const x = Math.cos(dec) * Math.cos(H);
    const y = Math.cos(dec) * Math.sin(H);
    const z = Math.sin(dec);

    const east = y;
    const north = z * Math.cos(lat) - x * Math.sin(lat);
    const up = z * Math.sin(lat) + x * Math.cos(lat);

    // Three.js: (x=east, y=up, z=-north)
    return new THREE.Vector3(east, up, -north).normalize();
}

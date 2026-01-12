import * as THREE from "three";

/**
 * Напрям руху Сонячної системи (Solar Apex).
 * Спрощено: фіксований галактичний напрямок.
 * Орієнтація в системі Three.js: (x=east, y=up, z=-north)
 */
export function getSolarSystemMotionDirection(): THREE.Vector3 {
    // Галактичний апекс (приблизно)
    const raDeg = 270;   // пряме сходження
    const decDeg = 30;   // схилення

    const rad = Math.PI / 180;
    const ra = raDeg * rad;
    const dec = decDeg * rad;

    // Екваторіальні координати → вектор
    const x = Math.cos(dec) * Math.cos(ra);
    const y = Math.sin(dec);
    const z = Math.cos(dec) * Math.sin(ra);

    // Three.js: (east, up, -north)
    return new THREE.Vector3(x, y, -z).normalize();
}

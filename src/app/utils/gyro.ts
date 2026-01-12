import * as THREE from "three";

export function enableGyroscope(camera: THREE.PerspectiveCamera) {
    const handler = (e: DeviceOrientationEvent) => {
        const alpha = THREE.MathUtils.degToRad(e.alpha ?? 0);
        const beta = THREE.MathUtils.degToRad(e.beta ?? 0);
        const gamma = THREE.MathUtils.degToRad(e.gamma ?? 0);

        // Орієнтація камери (YXZ — стабільно для мобільних)
        const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
        camera.quaternion.setFromEuler(euler);
    };

    window.addEventListener("deviceorientation", handler, true);

    // cleanup
    return () => window.removeEventListener("deviceorientation", handler, true);
}

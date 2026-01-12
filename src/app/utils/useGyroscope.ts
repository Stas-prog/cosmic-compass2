import * as THREE from "three";

export function enableGyroscope(camera: THREE.PerspectiveCamera) {
    const handler = (event: DeviceOrientationEvent) => {
        const alpha = THREE.MathUtils.degToRad(event.alpha ?? 0);
        const beta = THREE.MathUtils.degToRad(event.beta ?? 0);
        const gamma = THREE.MathUtils.degToRad(event.gamma ?? 0);

        const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
        camera.quaternion.setFromEuler(euler);
    };

    window.addEventListener("deviceorientation", handler, true);

    return () => window.removeEventListener("deviceorientation", handler);
}

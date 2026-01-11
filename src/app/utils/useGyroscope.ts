import * as THREE from "three";

export function enableGyroscope(camera: THREE.PerspectiveCamera) {
    const handler = (event: DeviceOrientationEvent) => {
        const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
        const beta = THREE.MathUtils.degToRad(event.beta || 0);
        const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

        const euler = new THREE.Euler(beta, alpha, -gamma, "YXZ");
        camera.quaternion.setFromEuler(euler);
    };

    const start = async () => {
        // @ts-ignore
        if (typeof DeviceOrientationEvent?.requestPermission === "function") {
            // @ts-ignore
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== "granted") return;
        }
        window.addEventListener("deviceorientation", handler);
    };

    return start;
}

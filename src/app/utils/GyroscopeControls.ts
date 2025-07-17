import * as THREE from 'three';

export default class GyroscopeControls {
    camera: THREE.Camera;
    enabled: boolean;

    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this.enabled = true;
    }

    connect() {
        window.addEventListener('deviceorientation', this.onOrientationChange);
    }

    disconnect() {
        window.removeEventListener('deviceorientation', this.onOrientationChange);
    }

    onOrientationChange = (event: DeviceOrientationEvent) => {
        const { alpha, beta, gamma } = event;
        if (alpha === null || beta === null || gamma === null) return;

        const euler = new THREE.Euler(
            THREE.MathUtils.degToRad(beta),
            THREE.MathUtils.degToRad(alpha),
            -THREE.MathUtils.degToRad(gamma),
            'YXZ'
        );

        this.camera.quaternion.setFromEuler(euler);
    };

    update() {
        // Нічого не робимо тут, бо обертання вже встановлено в onOrientationChange
    }
}

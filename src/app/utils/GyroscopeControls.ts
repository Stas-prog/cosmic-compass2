import * as THREE from 'three';

export default class GyroscopeControls {
    camera: THREE.Camera;
    enabled: boolean;
    orientationQuat: THREE.Quaternion;

    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this.enabled = false;
        this.orientationQuat = new THREE.Quaternion();
        this.handleOrientation = this.handleOrientation.bind(this);
    }

    connect() {
        if (typeof window === 'undefined') return;

        window.addEventListener('deviceorientation', this.handleOrientation, true);
        this.enabled = true;
    }

    disconnect() {
        window.removeEventListener('deviceorientation', this.handleOrientation, true);
        this.enabled = false;
    }

    handleOrientation(event: DeviceOrientationEvent) {
        const { alpha, beta, gamma } = event;
        if (alpha === null || beta === null || gamma === null) return;

        const degToRad = Math.PI / 180;

        const euler = new THREE.Euler(
            beta * degToRad,
            alpha * degToRad,
            -gamma * degToRad,
            'YXZ'
        );

        this.orientationQuat.setFromEuler(euler);
    }

    update() {
        if (this.enabled) {
            this.camera.quaternion.copy(this.orientationQuat);
        }
    }
}

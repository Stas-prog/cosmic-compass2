import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Object3DNode } from '@react-three/fiber'



// Додати, якщо ще не підключено
declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: ReactThreeFiber.Object3DNode<THREE.TextGeometry, typeof THREE.TextGeometry>;
            // textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>

        }
    }
}
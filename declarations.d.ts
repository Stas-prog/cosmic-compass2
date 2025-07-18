import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Object3DNode } from '@react-three/fiber'



declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: ReactThreeFiber.Object3DNode<THREE.TextGeometry, typeof THREE.TextGeometry>;
            // textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>

        }
    }
}

export { }


// declare namespace JSX {
//     interface IntrinsicElements {
//         mesh: any;
//         group: any;
//         line: any;
//         bufferGeometry: any;
//         sphereGeometry: any;
//         ringGeometry: any;
//         meshBasicMaterial: any;
//         lineBasicMaterial: any;
//         textGeometry: any;
//     }
// }

///  <reference types="react-three-fiber" />/

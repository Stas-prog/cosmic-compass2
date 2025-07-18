import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Object3DNode } from '@react-three/fiber'

declare module 'react-three-fiber' {
    interface ThreeElements {
        textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: ReactThreeFiber.Object3DNode<TextGeometry, typeof TextGeometry>
        }
    }
}

export { }



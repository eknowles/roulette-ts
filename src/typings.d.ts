import { Scene } from 'three';

declare global {
  interface Window {
    scene: Scene;
    THREE: any;
  }
}

import { Scene } from 'three';

declare global {
  /* tslint:disable:interface-name*/
  interface Window {
    scene: Scene;
    THREE: any;
  }
}

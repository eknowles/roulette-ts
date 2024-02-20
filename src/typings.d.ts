import { Scene, default as THREE } from 'three';
import { App } from './ui/app';

declare function require(name: string);

declare global {
  /* tslint:disable:interface-name*/
  interface Window {
    scene: Scene;
    THREE: THREE;
    app: App;
  }
}

import { Scene } from 'three';
import { App } from './ui/app';

declare function require(name: string);

declare global {
  /* tslint:disable:interface-name*/
  interface Window {
    scene: Scene;
    THREE: any;
    app: App;
  }
}

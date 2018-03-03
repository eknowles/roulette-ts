import { PerspectiveCamera } from 'three';

export class MainCamera {
  public instance: PerspectiveCamera;

  constructor() {
    const aspectRatio = window.innerWidth / window.innerHeight;

    this.instance = new PerspectiveCamera(75, aspectRatio, 0.01, 10);
    this.instance.position.z = 1;
    this.instance.position.x = 1;
    this.instance.position.y = 1;
    this.instance.lookAt(0, 0, 0);
  }
}

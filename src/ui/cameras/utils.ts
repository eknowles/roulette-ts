import { Easing, Tween } from '@tweenjs/tween.js';

export function tweenPosition({x, y, z}, duration = 5000) {
  const tween = new Tween(this.camera.instance.position)
    .to({x, y, z}, duration)
    .easing(Easing.Cubic.Out)
    .start();
}

import { Easing, Tween } from '@tweenjs/tween.js';

export function tweenPosition(pos, duration = 5000) {
  new Tween(this.camera.instance.position)
    .to(pos, duration)
    .easing(Easing.Cubic.Out)
    .start();
}

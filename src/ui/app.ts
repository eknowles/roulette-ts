import * as TWEEN from '@tweenjs/tween.js';

import { Group, Vector3 } from 'three';

import { POSITIONS } from '../game/constants/positions';
import { TYPES } from '../game/constants/types';
import * as CameraUtils from './cameras/utils';
import { generateNumberGrid } from './models/number-position';

import { BaseApp } from './base-app';
import { createChip } from './models/chip';

export class App extends BaseApp {
  private numbers: Group;

  constructor(elementId: string) {
    super(elementId);

    this.addAppEventListeners();

    // all the numbers to the scene (this should be done in 3d)
    this.numbers = generateNumberGrid();
    this.scene.add(this.numbers);

    this.render();

    // do a pretty tween effect
    CameraUtils.tweenPosition.call(this, {
      x: -.9,
      y: .4,
      z: .9,
    }, 5000);
  }

  public addAppEventListeners() {
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
  }

  /**
   * Each frame is rendered from this function
   */
  public render() {
    requestAnimationFrame(this.render.bind(this));
    TWEEN.update();
    const p14 = this.scene.getObjectByName('P_14');
    if (p14) {
      this.camera.instance.lookAt(p14.position.x, p14.position.y, p14.position.z);
    }
    this.renderer.render(this.scene, this.camera.instance);
  }

  /**
   * Handle click event on canvas
   * @param {MouseEvent} event
   */
  public onClick(event: MouseEvent) {
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    const positionId = intersects.map((i) => i.object.name)[0];
    const position = POSITIONS.find((p) => p.id === positionId);

    if (position) {
      const type = TYPES.find((t) => t.id === position.typeId);
      const obj = this.scene.getObjectByName(positionId);
      this.scene.add(createChip(obj.position));
      // console.log(type.id, positionId);
    }
  }
}

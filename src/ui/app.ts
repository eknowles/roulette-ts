import * as TWEEN from '@tweenjs/tween.js';

import { POSITIONS } from '../game/constants/positions';
import { TYPES } from '../game/constants/types';
import * as CameraUtils from './cameras/utils';
import { generateNumberGrid } from './models/number-position';

import { Object3D } from 'three/three-core';
import { BaseApp } from './base-app';
import { createChip } from './models/chip';
import { createFelt } from './models/table-cloth';

export class App extends BaseApp {
  constructor(elementId: string) {
    super(elementId);

    this.addAppEventListeners();

    this.scene.add(createFelt());
    this.scene.add(generateNumberGrid());

    this.setupGui(); // dat

    this.render();

    // do a pretty tween effect
    CameraUtils.tweenPosition.call(this, {x: -.2, y: .3, z: .6}, 1000);
    // CameraUtils.tweenPosition.call(this, {x: -1.9, y: 1.4, z: 1.9}, 5000);
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

    // update shadowCameraHelper and spotlightHelpers
    this.lighting.getHelpers().forEach((helper) => {
      helper.update();
    });

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
    const positionId = intersects
      .find((intersect) => {
        return intersect.object.userData.type === 'position';
      })
      .object.userData.positionId;

    const position = POSITIONS.find((p) => p.id === positionId);

    if (position) {
      const type = TYPES.find((t) => t.id === position.typeId);
      const obj = this.scene.getObjectByName(positionId);
      this.scene.add(createChip(obj.position));
      // console.log(type.id, positionId);
    }
  }

  private setupGui() {
    const params = {
      'angle': this.lighting.spot.angle,
      'decay': this.lighting.spot.decay,
      'distance': this.lighting.spot.distance,
      'intensity': this.lighting.spot.intensity,
      'light color': this.lighting.spot.color.getHex(),
      'penumbra': this.lighting.spot.penumbra,
    };

    this.gui.addColor(params, 'light color').onChange((val) => {
      this.lighting.spot.color.setHex(val);
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });
    this.gui.add(params, 'intensity', 0, 2).onChange((val) => {
      this.lighting.spot.intensity = val;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });
    this.gui.add(params, 'distance', 0, 10).onChange((val) => {
      this.lighting.spot.distance = val;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });
    this.gui.add(params, 'angle', 0, Math.PI / 3).onChange((val) => {
      this.lighting.spot.angle = val;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });
    this.gui.add(params, 'penumbra', 0, 1).onChange((val) => {
      this.lighting.spot.penumbra = val;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });
    this.gui.add(params, 'decay', 1, 2).onChange((val) => {
      this.lighting.spot.decay = val;
      this.renderer.shadowMap.needsUpdate = true;
      this.render();
    });

    this.gui.open();
  }
}

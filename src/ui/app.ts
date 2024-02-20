import { Easing, Tween, update as TweenUpdate } from '@tweenjs/tween.js';
import { get as _get } from 'lodash';
import * as THREE from 'three';
import { nanoid } from 'nanoid';
import { Game } from '../game';

import { BaseApp, IAppConfig } from './base';
import * as CameraUtils from './cameras/utils';
import * as constants from './constants';
import { highlightPosition, resetHighlights } from './helpers/highlights';
import { numberToChips } from './helpers/number-to-chips';
import { LoadingBar } from './loaders/loading-bar';

import { loadChip, loadChipMaterials } from './models/chip';
import { loadLayout } from './models/layout';
import { Scene } from "three";

export class App extends BaseApp {
  public static STATES = {
    BET: 'BET',
    LOADING: 'LOADING',
    SPIN_COMPLETED: 'SPIN_COMPLETED',
    SPIN_STARTED: 'SPIN_STARTED',
    WARM_UP: 'WARM_UP',
  };
  public game = new Game();
  public currentState = App.STATES.LOADING;
  public selectedChipValue = 1;
  private loadingBar: LoadingBar;
  private lastPosition: string | null;
  private loaded: boolean;

  constructor(elementId: string, config: IAppConfig) {
    super(elementId, config);
    this.loadingBar = new LoadingBar();
    this.addAppEventListeners();

    // Init
    Promise
      .all([
        loadChip(),
        loadLayout(),
      ])
      .then((scenes: Scene[]) => {
        this.scene.add(...scenes);

        return loadChipMaterials();
      })
      .then((textures: { [id: string]: THREE.Texture }) => {
        const baseChip = this.scene.getObjectByName('chip')!;

        baseChip.scale.x = .47;
        baseChip.scale.y = .47;
        baseChip.scale.z = .47;

        Object
          .keys(textures)
          .forEach((id) => {
            const chip = baseChip.clone(true) as THREE.Mesh;

            chip.name = '';
            chip.uuid = id;
            chip.material = chip.material.clone();
            (chip.material as THREE.MeshPhongMaterial).setValues({map: textures[id]});
            chip.position.set(0, 0, 0);
            chip.visible = false;
            this.scene.add(chip);
          });

        return Promise.resolve();
      })
      .then(() => {
        this.loaded = true;

        // Set state to warm up
        this.currentState = App.STATES.WARM_UP;

        // Kick off the render
        this.render();

        // Dolly camera
        CameraUtils.tweenPosition.call(this, constants.CAMERA_POSITION_FRONT, 3000);

        // Drop in highlight objects
        this.scene
          .getObjectByName('highlights')
          .children
          .forEach(this.animateHighlightsIn.bind(this));
      });
  }

  /**
   * tween the highlight objects in
   * @param {Object3D} child
   * @param {number} index
   */
  public animateHighlightsIn(child: THREE.Object3D, index: number): void {
    child.position.set(child.position.x, (index + 1) * 0.15, child.position.z);
    const newPosition = {...child.position, y: 0};

    new Tween(child.position)
      .to(newPosition, 2000)
      .easing(Easing.Cubic.Out)
      .onStart(() => {
        const mesh = child as THREE.Mesh;

        new Tween(mesh.material)
          .to({opacity: 0}, 2000)
          .delay(2000)
          .easing(Easing.Bounce.Out)
          .start();
      })
      .start()
      .onComplete(() => {
        this.currentState = App.STATES.BET;
        this.game.table.player.deposit(5000);
      });
  }

  public addAppEventListeners() {
    this.window.addEventListener('mousemove', this.handleHighlights.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
    this.document.addEventListener('keypress', this.onKey.bind(this), false);
  }

  public onKey(event: KeyboardEvent) {
    if (App.STATES.BET === this.currentState) {
      switch (event.key) {
        case '0':
          CameraUtils.tweenPosition.call(this, constants.CAMERA_POSITION_TOP, 1000);
          break;
        case '1':
          CameraUtils.tweenPosition.call(this, constants.CAMERA_POSITION_FRONT, 1000);
          break;
        case '2':
          CameraUtils.tweenPosition.call(this, constants.CAMERA_POSITION_SIDE, 1000);
          break;
        case '3':
          CameraUtils.tweenPosition.call(this, constants.CAMERA_POSITION_OVERVIEW, 1000);
          break;
      }
    }
  }

  public onAddBalance() {
    const amount = prompt('Enter deposit amount', '5000');
    if (amount != null && !isNaN(amount)) {
      this.game.table.player.deposit(parseInt(amount, 10));
    }
  }

  /**
   * Each frame is rendered from this function
   */
  public render() {
    requestAnimationFrame(this.render.bind(this));
    TweenUpdate();

    this.camera.instance.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera.instance);
  }

  /**
   * Handle click event on canvas.
   * Type of click interactions include either select value chip or placement
   * @param {MouseEvent} event
   */
  public onClick(event: MouseEvent) {
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    if (this.currentState === App.STATES.BET && this.selectedChipValue > 0) {
      this.placeBet();
    }
  }

  public handleHighlights(event: MouseEvent) {
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // game is in bet mode
    if (this.currentState === App.STATES.BET) {
      const positionIntersect = intersects.find((intersect) => {
        return intersect.object.userData.type === constants.MESH_TYPE_POSITION;
      });

      if (positionIntersect && positionIntersect.object.userData.positionId) {
        const positionId = positionIntersect.object.userData.positionId;

        if (positionId === this.lastPosition) {
          return;
        }

        resetHighlights(this.scene);

        this.lastPosition = positionId;

        highlightPosition(this.scene, positionId);
      } else {
        this.lastPosition = null;
        resetHighlights(this.scene);
      }
    }
  }

  public placeBet() {
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    const positionIntersect = intersects.find((intersect) => {
      return intersect.object && intersect.object.userData.type === constants.MESH_TYPE_POSITION;
    });

    let obj = _get(positionIntersect, 'object') as THREE.Mesh;

    if (positionIntersect && obj && obj.userData.positionId && obj.type === 'Mesh') {

      if (obj.userData.positionProxy) {
        obj = this.scene.getObjectByProperty('uuid', obj.userData.positionId) as THREE.Mesh;
      }

      const positionId = obj.userData.positionId;

      try {
        // place bet
        this.game.table.currentSpin.placeBet(this.selectedChipValue, positionId);

        const currentValue = this.game.table.currentSpin.bets[positionId];
        const requiredChips = numberToChips(currentValue);
        const currentChips = [];

        this.scene.traverse((child) => {
          const isChip = child.userData.type === constants.MESH_TYPE_CHIP;
          const isSelectedPosition = child.userData.positionId === positionId;
          if (isChip && isSelectedPosition) {
            currentChips.push(child);
          }
        });

        currentChips.forEach((chip) => {
          this.scene.remove(chip);
        });

        // setup positions
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        // decompose clicked objects world positions
        obj.matrixWorld.decompose(position, quaternion, scale);

        requiredChips.forEach((id, index, arr) => {
          // copy the base chip into a var

          const chip = this.scene
            .getObjectByProperty('uuid', id)
            .clone(true) as THREE.Mesh;

          chip.material = chip.material.clone() as THREE.MeshPhongMaterial;

          // set a new UUID
          chip.uuid = nanoid();

          // set the objects data
          chip.userData = {
            chipIndex: index,
            chipTexture: id,
            positionId,
            type: constants.MESH_TYPE_CHIP,
          };

          const y = position.y + (index * constants.CHIP_HEIGHT);

          chip.position.set(position.x, y, position.z);

          // animate top chip on stack
          if (index === (arr.length - 1)) {
            chip.position.set(position.x, y + .7, position.z);
            chip.rotation.set(chip.rotation.x - (Math.PI), chip.rotation.y, chip.rotation.z);

            new Tween(chip.position)
              .to({...position, y}, 700)
              .easing(Easing.Circular.Out)
              .start();

            new Tween(chip.rotation)
              .to({x: chip.rotation.x + (Math.PI)}, 600)
              .easing(Easing.Sinusoidal.Out)
              .start();
          }

          // add the chip to the scene
          chip.visible = true;
          this.scene.add(chip);
        });

      } catch (err) {
        // todo better alerting
        this.window.alert(err.message);
      }
    }
  }
}

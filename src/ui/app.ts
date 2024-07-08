import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import * as ColladaLoader from "three-collada-loader";

import { BaseApp } from "./base";
import * as CameraUtils from "./cameras/utils";
import * as constants from "./constants";
import { highlightPosition, resetHighlights } from "./helpers/highlights";
import { LoadingBar } from "./loaders/loading-bar";

export class App extends BaseApp {
  private loadingBar: LoadingBar;
  private lastPosition: string;

  constructor(elementId: string, config) {
    super(elementId, config);
    this.loadingBar = new LoadingBar();
    this.addAppEventListeners();
    this.setupModels();
    this.render();
    CameraUtils.tweenPosition.call(
      this,
      constants.CAMERA_POSITION_OVERVIEW,
      300,
    );
  }

  public setupModels() {
    const daeLoader = new ColladaLoader();

    daeLoader.load("./blender/test.dae", (collada: THREE.ColladaModel) => {
      const scene = collada.scene;

      scene.traverse((child) => {
        const isHighlight = child.name.charAt(0) === "H";
        const isPosition = child.name.charAt(0) === "P";

        if (isHighlight) {
          child.children.forEach((mesh: THREE.Mesh) => {
            mesh.material.setValues({
              blending: THREE.AdditiveBlending,
              opacity: 0,
              transparent: true,
            });
            child.userData = {
              highlightId: child.name,
              type: constants.MESH_TYPE_HIGHLIGHT,
            };
          });
        }

        if (isPosition) {
          // we account for multiple position references using a suffix (e.g. P_3-001)
          const positionId = child.name.split("-")[0];

          child.children.forEach((mesh: THREE.Mesh) => {
            mesh.material.setValues({ opacity: 0, transparent: true });
            mesh.userData = { positionId, type: constants.MESH_TYPE_POSITION };
          });
        }
      });

      scene.rotateX(Math.PI / -2);
      scene.scale.x = 3;
      scene.scale.y = 3;
      scene.scale.z = 3;

      this.scene.add(scene);
    });
  }

  public addAppEventListeners() {
    this.window.addEventListener(
      "mousemove",
      this.handleHighlights.bind(this),
      false,
    );
    this.renderer.domElement.addEventListener(
      "click",
      this.onClick.bind(this),
      false,
    );
    this.document.addEventListener("keypress", this.onKey.bind(this), false);
  }

  public onKey(event: KeyboardEvent) {
    switch (event.key) {
      case "0":
        CameraUtils.tweenPosition.call(
          this,
          constants.CAMERA_POSITION_TOP,
          1000,
        );
        break;
      case "1":
        CameraUtils.tweenPosition.call(
          this,
          constants.CAMERA_POSITION_FRONT,
          1000,
        );
        break;
      case "2":
        CameraUtils.tweenPosition.call(
          this,
          constants.CAMERA_POSITION_SIDE,
          1000,
        );
        break;
      case "3":
        CameraUtils.tweenPosition.call(
          this,
          constants.CAMERA_POSITION_OVERVIEW,
          1000,
        );
        break;
    }
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

    this.camera.instance.up.set(0, 1, 0);
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
  }

  public handleHighlights(event: MouseEvent) {
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true,
    );

    // game is in bet mode
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
      resetHighlights(this.scene);
    }
  }
}

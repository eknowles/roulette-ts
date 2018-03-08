import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

import { POSITIONS } from '../game/constants/bet-positions';
import { TYPES } from '../game/constants/bet-types';
import { NUMBERS } from '../game/constants/numbers';
import { MainCamera } from './cameras/main.camera';
import { NumberPosition } from './models/number-position';

export class App {
  public DEBUG = true;
  public camera: MainCamera;
  public scene: THREE.Scene;
  public renderer: THREE.Renderer;
  public raycaster: THREE.Raycaster;
  public mouse: THREE.Vector2;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = new MainCamera();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.setup();

    // demo
    this.addNumbers();

    this.render();

    // demo animation
    const tween = new TWEEN.Tween(this.camera.instance.position)
      .to({x: 0.7, y: 0.4, z: 0.7}, 10000)
      .start();
  }

  public setup() {
    // setup

    if (this.DEBUG) {
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    }

    document.getElementById('world').appendChild(this.renderer.domElement);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
  }

  public addNumbers() {
    const numbers = new THREE.Group();
    const itemsPerRow = 7;

    let currentRow = 0;
    let currentCol = 0;
    NUMBERS
      .forEach((n, index) => {
      currentCol++;
      if (!(index % itemsPerRow)) {
        currentRow++;
        currentCol = 1;
      }
      const mesh = NumberPosition(n.number, n.color);
      const size = 0.1;
      mesh.translateX((currentCol * size) - size);
      mesh.translateZ((currentRow * size) - size);
      numbers.add(mesh);
    });

    this.scene.add(numbers);
  }

  public render() {
    requestAnimationFrame(this.render.bind(this));
    TWEEN.update();
    this.camera.instance.lookAt(0.3, 0, 0.3);
    this.renderer.render(this.scene, this.camera.instance);
  }

  public onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  public onWindowResize() {
    this.camera.instance.aspect = window.innerWidth / window.innerHeight;
    this.camera.instance.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public onClick(event: MouseEvent) {
    this.onMouseMove(event);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    const positionId = intersects.map((i) => i.object.name)[0];
    const position = POSITIONS.find((p) => p.id === positionId);

    const createChip = (pos) => {
      const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 32);
      const material = new THREE.MeshBasicMaterial({color: 'white'});
      const chip = new THREE.Mesh(geometry, material);
      chip.position.x = pos.x;
      chip.position.y = pos.y;
      chip.position.z = pos.z;
      return chip;
    };

    if (position) {
      const type = TYPES.find((t) => t.id === position.typeId);
      const obj = this.scene.getObjectByName(positionId);
      this.scene.add(createChip(obj.position));
      // console.log(type.id, positionId);
    }
  }
}

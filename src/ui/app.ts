import {
  AxesHelper,
  Color, Group, Raycaster, Renderer, Scene, Vector2, WebGLRenderer,
} from 'three';

import * as TWEEN from '@tweenjs/tween.js';

import { NUMBERS } from '../game/constants/numbers';
import { MainCamera } from './cameras/main.camera';
import { NumberPosition } from './models/number-position';

export class App {
  public camera: MainCamera;
  public scene: Scene;
  public renderer: Renderer;
  public raycaster: Raycaster;
  public mouse: Vector2;
  public DEBUG = true;

  constructor() {
    this.init();
    this.render();
    const tween = new TWEEN.Tween(this.camera.instance.position)
      .to({x: 0, y: 0, z: 1}, 5000)
      .start();
  }

  public init() {
    // setup
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.camera = new MainCamera();
    this.scene = new Scene();

    // set scene bg
    this.scene.background = new Color('white');

    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Add numbers
    const numbers = new Group();
    NUMBERS.forEach((n, index) => {
      const mesh = NumberPosition(n.number, n.color);
      mesh.translateX(index * 0.1);
      numbers.add(mesh);
    });
    this.scene.add(numbers);

    // debug
    const axesHelper = new AxesHelper(5);
    this.scene.add(axesHelper);

    // attach to dom
    document.body.appendChild(this.renderer.domElement);

    // events
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
  }

  public render() {
    requestAnimationFrame(this.render.bind(this));
    TWEEN.update();
    this.camera.instance.lookAt(0, 0, 0);
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
  }
}

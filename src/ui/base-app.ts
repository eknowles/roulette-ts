import { Raycaster, Renderer, Scene, Vector2, WebGLRenderer } from 'three';

import { MainCamera } from './cameras/main.camera';

export abstract class BaseApp {
  public static ERROR_NO_ELEMENT = 'Could not find DOM element';
  public camera: MainCamera;
  public scene: Scene;
  public renderer: Renderer;
  public raycaster: Raycaster;
  public mouse: Vector2;
  public elementId: string;
  public document: Document;
  public window: Window;
  public element: HTMLElement;

  /**
   * @param {string} elementId DOM element id
   */
  constructor(elementId: string) {
    this.document = document;
    this.window = window;

    // prepare element for canvas
    this.elementId = elementId;
    this.element = this.document.getElementById(this.elementId);

    if (!this.element) {
      throw new Error(BaseApp.ERROR_NO_ELEMENT);
    }

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.camera = new MainCamera();
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({antialias: true, alpha: true});

    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);

    this.attachRenderer();
    this.addEventListeners();
  }

  /**
   * Update camera aspect ratio and canvas size to fill window
   * @param {UIEvent} event
   */
  public onWindowResize(event: UIEvent) {
    const w = this.window.innerWidth;
    const h = this.window.innerHeight;

    this.camera.instance.aspect = w / h;
    this.camera.instance.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /**
   * Update mouse x,y values according to three.js center
   * @param {MouseEvent} event
   */
  public onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.window.innerHeight) * 2 + 1;
  }

  /**
   * Add event listeners to window
   */
  private addEventListeners() {
    this.window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  /**
   * Add canvas element to DOM
   */
  private attachRenderer() {
    this.element.appendChild(this.renderer.domElement);
  }
}

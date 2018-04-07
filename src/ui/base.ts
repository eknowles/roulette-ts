import { Fog, PCFSoftShadowMap, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';

import { MainCamera } from './cameras/main.camera';
import { Grid as gridHelper } from './helpers/grid';
import { Lighting } from './lighting';

export interface IAppConfig {
  drawHelpers?: boolean;
  highQuality?: boolean;
}

/**
 * This class is the base for a three js app
 */
export abstract class BaseApp {
  public static ERROR_NO_ELEMENT = 'Could not find DOM element';
  public elementId: string;
  public camera: MainCamera;
  public scene: Scene;
  public renderer: WebGLRenderer;
  public raycaster: Raycaster;
  public mouse: Vector2;
  public document: Document;
  public window: Window;
  public element: HTMLElement;
  public lighting: Lighting;
  public config: IAppConfig;

  /**
   * @param {string} elementId DOM element id
   * @param config
   */
  protected constructor(elementId: string, config: IAppConfig = {}) {
    this.config = config;
    this.document = document;
    this.window = window;

    // prepare element for canvas
    this.elementId = elementId;
    this.element = this.document.getElementById(this.elementId);

    if (!this.element) {
      throw new Error(BaseApp.ERROR_NO_ELEMENT);
    }

    this.init();
  }

  public init() {
    // input
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.camera = new MainCamera();

    // custom
    this.lighting = new Lighting();

    // renderer
    this.renderer = new WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setPixelRatio(this.window.devicePixelRatio);
    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    this.renderer.shadowMap.enabled = this.config.highQuality || false;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.sortObjects = true;
    this.attachRenderer();

    // scene
    this.scene = new Scene();
    this.scene.fog = new Fog(0x000000, 10, 20);
    this.scene.add(...this.lighting.getLights());

    if (this.config.drawHelpers) {
      this.scene.add(...this.lighting.getHelpers());
      this.scene.add(gridHelper());
    }

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

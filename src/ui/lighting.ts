import { AmbientLight, CameraHelper, SpotLight, SpotLightHelper } from 'three';

/**
 * This class holds the lighting objects for the the main scene
 */
export class Lighting {
  public spot: SpotLight;
  public shadowCameraHelper: CameraHelper;
  public spotHelper: SpotLightHelper;
  public ambient: AmbientLight;

  constructor() {
    this.spot = new SpotLight(0xffffff);
    this.spot.position.set(1, 1, 1);
    this.spot.angle = Math.PI / 4;

    this.spot.castShadow = true;
    this.spot.shadow.mapSize.width = 1024;
    this.spot.shadow.mapSize.height = 1024;
    this.spot.shadow.camera.near = 1;
    this.spot.shadow.camera.far = 3;
    this.spot.shadow.camera.fov = 50;

    // add a general ambient light to get rid of hard shadows
    this.ambient = new AmbientLight(0xffffff, 0.1);

    // helpers
    this.spotHelper = new SpotLightHelper(this.spot);
    this.shadowCameraHelper = new CameraHelper(this.spot.shadow.camera);
  }

  /**
   * This method will return all lighting objects to be added to a scene
   * @return {any[]}
   */
  public getObject(): any[] {
    return [...this.getLights(), ...this.getHelpers()];
  }

  public getLights(): any[] {
    return [
      this.spot,
      this.ambient,
    ];
  }

  /**
   * This method returns all lighting helpers that have an update method to be called in the render cycle
   * @return {any[]}
   */
  public getHelpers(): any[] {
    return [
      this.shadowCameraHelper,
      this.spotHelper,
    ];
  }
}

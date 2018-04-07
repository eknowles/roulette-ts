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
    this.spot.position.set(3, 5, 0);

    this.spot.angle = Math.PI / 4;

    this.spot.intensity = 8;
    this.spot.distance = 10;
    this.spot.penumbra = 1;
    this.spot.shadow.mapSize.width = 1024;
    this.spot.shadow.mapSize.height = 1024;
    this.spot.shadow.camera.near = 3;
    this.spot.shadow.camera.far = 15;

    // add a general ambient light to get rid of hard shadows
    this.ambient = new AmbientLight(0xffffff, .15);

    // helpers
    this.spotHelper = new SpotLightHelper(this.spot);
    this.shadowCameraHelper = new CameraHelper(this.spot.shadow.camera);
  }

  public getLights(): any[] {
    return [
      // this.spot,
      // this.ambient,
    ];
  }

  /**
   * This method returns all lighting helpers that have an update method to be called in the render cycle
   * @return {any[]}
   */
  public getHelpers(): any[] {
    return [
      // this.shadowCameraHelper,
      // this.spotHelper,
    ];
  }
}

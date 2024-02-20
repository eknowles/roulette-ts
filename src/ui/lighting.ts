import { AmbientLight, CameraHelper, SpotLight, SpotLightHelper, Light } from 'three';

/**
 * This class holds the lighting objects for the main scene
 */
export class Lighting {
  public spot: SpotLight;
  public spot1: SpotLight;
  public shadowCameraHelper: CameraHelper;
  public spotHelper: SpotLightHelper;
  public ambient: AmbientLight;

  constructor() {
    this.spot = this.createSpot();
    this.spot1 = this.createSpot();
    this.spot.position.set(-1, 2.5, 1);
    this.spot1.position.set(1, 5, -1);

    // add a general ambient light to get rid of hard shadows
    this.ambient = new AmbientLight(0xffffff, 0.85);

    // helpers
    this.spotHelper = new SpotLightHelper(this.spot);
    this.shadowCameraHelper = new CameraHelper(this.spot.shadow.camera);
  }

  public getLights(): Light[] {
    return [
      this.spot1,
      this.spot,
      this.ambient,
    ];
  }

  /**
   * This method returns all lighting helpers that have an update method to be called in the render cycle
   * @return {any[]}
   */
  public getHelpers(): unknown[] {
    return [
      this.shadowCameraHelper,
      this.spotHelper,
    ];
  }

  private createSpot() {
    const spot = new SpotLight(0xffffff);
    spot.angle = Math.PI / 4;
    spot.intensity = 2;
    spot.distance = 15;
    spot.penumbra = 0.4;
    spot.shadow.mapSize.set(2048, 2048);
    spot.shadow.radius = 2;
    spot.shadow.camera.near = 3;
    spot.shadow.camera.far = 20;

    spot.castShadow = true;
    return spot;
  }
}

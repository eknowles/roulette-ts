import * as THREE from 'three';

export class Chip extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 5);
    const material = new THREE.MeshNormalMaterial();

    super(geometry, material);
  }
}

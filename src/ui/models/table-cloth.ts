import { Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { Z_INDEX_CLOTH } from '../constants';

export function createFelt(): Mesh {
  const geometry = new PlaneGeometry(1.2, 3);
  const material = new MeshLambertMaterial({color: '#1A1F31', dithering: true});

  geometry.rotateX(Math.PI / -2);
  geometry.translate(.1, Z_INDEX_CLOTH, .5);

  const mesh = new Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

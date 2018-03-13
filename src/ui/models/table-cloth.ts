import { Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry } from 'three';

export function createFelt(): Mesh {
  const geometry = new PlaneGeometry(1.2, 3);

  geometry.rotateX(Math.PI / -2);
  geometry.translate(.1, -.0001, .5);

  const material = new MeshPhongMaterial({color: '#2d223c'});
  const mesh = new Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

import { CylinderGeometry, Mesh, MeshBasicMaterial } from 'three';

export function createChip(pos) {
  const geometry = new CylinderGeometry(0.025, 0.025, 0.01, 16);
  const material = new MeshBasicMaterial({color: 'white'});
  const chip = new Mesh(geometry, material);
  chip.position.x = pos.x;
  chip.position.y = pos.y;
  chip.position.z = pos.z;
  return chip;
}

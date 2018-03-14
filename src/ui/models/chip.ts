import { CylinderGeometry, Mesh, MeshLambertMaterial } from 'three';

export const CHIP_HEIGHT = .005;
export const CHIP_RADIUS = .025;

/**
 * Create a chip mesh
 * @param pos
 * @param {number} color
 * @return {Mesh}
 */
export function createChip(pos, color = 0xffffff): Mesh {
  const geometry = new CylinderGeometry(CHIP_RADIUS, CHIP_RADIUS, CHIP_HEIGHT, 16);
  const material = new MeshLambertMaterial({color, dithering: true});
  const chip = new Mesh(geometry, material);

  chip.position.x = pos.x;
  chip.position.y = pos.y + (CHIP_HEIGHT / 2);
  chip.position.z = pos.z;

  chip.castShadow = true;
  chip.receiveShadow = true;

  return chip;
}

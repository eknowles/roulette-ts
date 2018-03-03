import { BoxGeometry, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

export function NumberPosition(number: number, color: string): Mesh {
  const geometry = new BoxGeometry(0.1, 0.1, 0.1);

  geometry.name = `N_${number}`; // Set numbers name

  const material = new MeshBasicMaterial({color: color.toLowerCase(), side: DoubleSide});

  const mesh = new Mesh(geometry, material);

  return mesh;
}

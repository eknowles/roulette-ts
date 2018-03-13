import { Group, Mesh, MeshLambertMaterial, PlaneGeometry } from 'three';

import { NUMBERS } from '../../game/constants/numbers';

export const DEFAULT_CELL_WIDTH = .2;
export const DEFAULT_CELL_DEPTH = .1;
export const DOZEN_SEPERATION = .01;

export function NumberPosition(number: number, color: string): Mesh {
  const geometry = new PlaneGeometry(
    DEFAULT_CELL_WIDTH,
    DEFAULT_CELL_DEPTH,
  );

  geometry.rotateX(Math.PI / -2);

  const material = new MeshLambertMaterial({
    color: color.toLowerCase(),
    dithering: true,
    wireframe: false,
  });
  const mesh = new Mesh(geometry, material);

  mesh.userData = {
    positionId: `P_${number}`,
    positionType: 'STRAIGHT',
    type: 'position',
  };

  // set mesh name so we can query it later
  mesh.name = `P_${number === 0 ? 'ZERO' : number}`;

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

export function generateNumberGrid(): Group {
  const group = new Group();
  const itemsPerRow = 3;

  let currentRow = 0;
  let currentCol = 0;

  // get all numbers on wheel in order
  const orderedNumbers = NUMBERS.sort((a, b) => a.number - b.number);

  // grab the zero as we want to stretch it across all columns
  const numZero = orderedNumbers.shift();

  // create the zero position
  const zero = NumberPosition(numZero.number, numZero.color);

  // update zero geometry to fit across all rows
  zero.geometry = new PlaneGeometry(
    DEFAULT_CELL_WIDTH * itemsPerRow,
    DEFAULT_CELL_DEPTH,
    2,
  );

  // give the zero position a pointy bit at the top
  zero.geometry.vertices[1].y += DEFAULT_CELL_DEPTH;
  zero.geometry.verticesNeedUpdate = true;

  zero.geometry.rotateX(Math.PI / -2);
  zero.translateX(DEFAULT_CELL_WIDTH);
  zero.translateZ(-(DEFAULT_CELL_DEPTH + DOZEN_SEPERATION));

  // add zero to the group
  group.add(zero);

  // iterate over the other numbers on the wheel
  orderedNumbers.forEach((n, index) => {
    currentCol++;
    if (!(index % itemsPerRow)) {
      currentRow++;
      currentCol = 1;
    }

    const mesh = NumberPosition(n.number, n.color);

    // position the cell in the right column
    mesh.translateX((currentCol * (DEFAULT_CELL_DEPTH * 2)) - (DEFAULT_CELL_DEPTH * 2));

    let dozenMultipler = 0;

    if (n.number > 12) {
      dozenMultipler += DOZEN_SEPERATION; // second dozen add a gap a the top
    }

    if (n.number > 24) {
      dozenMultipler += DOZEN_SEPERATION; // third dozen add a gap a the top
    }

    // position the column on the right row
    mesh.translateZ(((currentRow * DEFAULT_CELL_DEPTH) - DEFAULT_CELL_DEPTH) + dozenMultipler);

    // add the mesh to the THREE.Group
    group.add(mesh);
  });

  return group;
}

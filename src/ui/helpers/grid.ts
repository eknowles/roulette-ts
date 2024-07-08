import { GridHelper, Vector3 } from "three";

export function Grid() {
  const grid = new GridHelper(10, 10);
  const vector = new Vector3(0, 0, 0);
  grid.lookAt(vector);
  return grid;
}

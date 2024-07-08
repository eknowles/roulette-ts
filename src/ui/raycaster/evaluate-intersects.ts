import { Intersection, Object3D } from "three";

/**
 * This method will return the first object that has a type of 'position' in it's user data.
 * @param {Intersection[]} intersects
 * @param type
 * @return {Object3D}
 */
export function getIntersectionByType(
  intersects: Intersection[],
  type: string,
): Object3D {
  const intersection = intersects.find(
    (intersect) =>
      intersect.object.userData && intersect.object.userData.type === type,
  );

  if (intersection) {
    return intersection.object;
  }
}

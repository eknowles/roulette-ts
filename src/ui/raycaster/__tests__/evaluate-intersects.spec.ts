import { getIntersectionByType } from '../evaluate-intersects';
import { Intersection } from "three";

describe('Helpers', () => {
  describe('getIntersectionByType()', () => {
    it('should return the first object in array with userData.type of given param', () => {
      const testIntersects = [
        {object: {userData: {type: 'foo'}}},
        {object: {userData: {type: 'bar'}}},
        {object: {}},
        {object: {userData: {}}},
        {object: {userData: {type: 'test'}}},
      ] as Intersection[];
      expect(getIntersectionByType(testIntersects, 'test')).toBe(testIntersects[4].object);
    });
  });
});

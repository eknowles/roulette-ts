import { getIntersectionByType } from '../evaluate-intersects';

describe('Helpers', () => {
  describe('getIntersectionByType()', () => {
    it('should return the first object in array with userData.type of given param', () => {
      const testIntersects: any = [
        {object: {userData: {type: 'foo'}}},
        {object: {userData: {type: 'bar'}}},
        {object: {}},
        {object: {userData: {}}},
        {object: {userData: {type: 'test'}}},
      ];
      expect(getIntersectionByType(testIntersects, 'test')).toBe(testIntersects[4].object);
    });
  });
});

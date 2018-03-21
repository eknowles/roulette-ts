import { POSITIONS } from '../../constants/positions';
import { Statistics } from '../statistics';

describe('Class', () => {
  describe('Statistics', () => {
    describe('getPositionCount()', () => {
      it('should return an object of all positionIds', () => {
        const result = Statistics.getPositionCount([]);
        Object.values(POSITIONS).forEach((pos) => {
          expect(result[pos.id]).toBeDefined();
          expect(typeof result[pos.id]).toBe('number');
        });
      });
      it('should return just the positions with typeId when specified in the second param', () => {
        expect(Statistics.getPositionCount([], 'ROW')).toEqual({P_ROW: 0});
        expect(Statistics.getPositionCount([], 'ZERO')).toEqual({P_ZERO: 0});
      });
    });
  });
});

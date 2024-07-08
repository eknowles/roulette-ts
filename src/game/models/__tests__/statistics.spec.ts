import { POSITIONS } from "../../constants/positions";
import { Statistics } from "../statistics";

describe("Class", () => {
  describe("Statistics", () => {
    describe("getPositionCount()", () => {
      it("should return an object of all positionIds", () => {
        const result = Statistics.getPositionCount([]);
        Object.values(POSITIONS).forEach((pos) => {
          expect(result[pos.id]).toBeDefined();
          expect(typeof result[pos.id]).toBe("number");
        });
      });
      it("should return just the positions with typeId when specified in the second param", () => {
        expect(Statistics.getPositionCount([], "T_ZERO")).toEqual({
          P_ZERO: 0,
        });
      });
      it("should total the number of winning positions", () => {
        expect(Statistics.getPositionCount([], "T_ZERO")).toEqual({
          P_ZERO: 0,
        });
        expect(Statistics.getPositionCount([0], "T_ZERO")).toEqual({
          P_ZERO: 1,
        });
        expect(Statistics.getPositionCount([0, 0, 0], "T_ZERO")).toEqual({
          P_ZERO: 3,
        });
      });
      it("should throw error when given bad typeId", () => {
        const fn = () => Statistics.getPositionCount([], "BAD");
        expect(fn).toThrow(Statistics.ERROR_BAD_TYPE_ID);
      });
    });
  });
});

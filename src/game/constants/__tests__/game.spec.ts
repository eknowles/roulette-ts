import * as constants from "../game";

describe("Game", () => {
  describe("Constants", () => {
    it("should set MAX_DEPOSIT_VALUE value as 10000", () => {
      expect(constants.MAX_DEPOSIT_VALUE).toBe(10000);
    });
    it("should set MIN_DEPOSIT_VALUE value as 1", () => {
      expect(constants.MIN_DEPOSIT_VALUE).toBe(1);
    });
    it("should set MAX_OUTSIDE_BET_VALUE value as 500", () => {
      expect(constants.MAX_OUTSIDE_BET_VALUE).toBe(500);
    });
    it("should set MIN_OUTSIDE_BET_VALUE value as 5", () => {
      expect(constants.MIN_OUTSIDE_BET_VALUE).toBe(5);
    });
    it("should set MAX_INSIDE_BET_VALUE value as 5000", () => {
      expect(constants.MAX_INSIDE_BET_VALUE).toBe(5000);
    });
  });
});

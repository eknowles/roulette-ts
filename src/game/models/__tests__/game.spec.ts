import { Game } from "../game";
import { Table } from "../table";

describe("Class", () => {
  describe("Game", () => {
    describe("constructor", () => {
      it("should create a new table", () => {
        const game = new Game();
        expect(game.table).toBeDefined();
        expect(game.table instanceof Table).toBe(true);
      });
      it("should set a createdAt property", () => {
        const game = new Game();
        expect(game.createdAt).toBeDefined();
        expect(typeof game.createdAt).toBe("number");
      });
    });
  });
});

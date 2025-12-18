import * as module from "../index";

describe("Game", () => {
  it("should export models", () => {
    expect(module.Game).toBeDefined();
    expect(module.Player).toBeDefined();
    expect(module.Round).toBeDefined();
    expect(module.Table).toBeDefined();
  });
});

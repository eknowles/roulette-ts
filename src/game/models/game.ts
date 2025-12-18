import { Player } from "./player";
import { Table } from "./table";

export class Game {
  public table: Table;
  public createdAt: number;

  constructor() {
    const player = new Player();
    this.table = new Table(player);
    this.createdAt = Date.now();
  }
}

import { Player } from './player.model';
import { Table } from './table.model';

export class Game {
  public table: Table;
  public createdAt: number;

  constructor() {
    const player = new Player();
    this.table = new Table(player);
    this.createdAt = Date.now();
  }
}

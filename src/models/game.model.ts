import { TableModel } from './table.model';
import { PlayerModel } from './player.model';

export class GameModel {
  public table: TableModel;
  public createdAt: number;

  constructor() {
    const player = new PlayerModel();
    this.table = new TableModel(player);
    this.createdAt = Date.now();
  }
}

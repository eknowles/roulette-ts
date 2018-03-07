import { POSITIONS } from '../constants/bet-positions';
import { TYPES } from '../constants/bet-types';
import { NUMBERS } from '../constants/numbers';
import { Player } from './player.model';
import { Spin } from './spin.model';

export class Table {
  public numbers = NUMBERS;
  public positions = POSITIONS;
  public types = TYPES;
  public player: Player;
  public currentSpin: Spin;
  public previousSpins: Spin[];

  constructor(player: Player) {
    this.player = player;
    this.currentSpin = new Spin(this.player);
    this.previousSpins = [];
  }

  public newSpin() {
    this.previousSpins.push(this.currentSpin);
    this.currentSpin = new Spin(this.player);
  }
}

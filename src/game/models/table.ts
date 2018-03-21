import { NUMBERS } from '../constants/numbers';
import { POSITIONS } from '../constants/positions';
import { TYPES } from '../constants/types';
import { Player } from './player';
import { Round } from './round';

export class Table {
  public numbers = NUMBERS;
  public positions = POSITIONS;
  public types = TYPES;
  public player: Player;
  public currentSpin: Round;
  public previousSpins: Round[];

  constructor(player: Player) {
    this.player = player;
    this.currentSpin = new Round(this.player);
    this.previousSpins = [];
  }

  public newSpin() {
    this.previousSpins.push(this.currentSpin);
    this.currentSpin = new Round(this.player);
  }

  public winningNumbers(): number[] {
    return this.previousSpins.map((round) => round.winner);
  }
}

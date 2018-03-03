import { POSITIONS } from '../constants/bet-positions';
import { TYPES } from '../constants/bet-types';
import { NUMBERS } from '../constants/numbers';
import { PlayerModel } from './player.model';
import { SpinModel } from './spin.model';

export class TableModel {
  public numbers = NUMBERS;
  public positions = POSITIONS;
  public types = TYPES;
  public player: PlayerModel;
  public currentSpin: SpinModel;
  public previousSpins: SpinModel[];

  constructor(player: PlayerModel) {
    this.player = player;
    this.currentSpin = new SpinModel(this.player);
    this.previousSpins = [];
  }

  public newSpin() {
    this.previousSpins.push(this.currentSpin);
    this.currentSpin = new SpinModel(this.player);
  }
}

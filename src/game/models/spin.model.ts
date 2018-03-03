import { POSITIONS } from '../constants/bet-positions';
import { TYPES } from '../constants/bet-types';
import { PlayerModel } from './player.model';

export interface IBet {
  [positionId: string]: number;
}

export class SpinModel {
  public createdAt: number;
  public bets: IBet;
  public winner: null | number;
  public player: PlayerModel;

  constructor(player: PlayerModel) {
    this.createdAt = Date.now();
    this.player = player;
    this.bets = {};
    this.winner = null;
  }

  public removePosition(positionId: string) {
    this.player.returnBet(this.bets[positionId]);
    delete this.bets[positionId];
  }

  public placeBet(amount: number, positionId: string) {
    if (this.player.bank < amount) {
      return;
    }

    if (this.bets[positionId]) {
      this.bets[positionId] += amount;
    } else {
      this.bets[positionId] = amount;
    }

    this.player.bet(amount);
  }

  public run() {
    this.getNumber().then((number) => {
      this.winner = number;
      this.processWin();
    });
  }

  private processWin() {
    Object
      .keys(this.bets)
      .forEach((positionId) => {
        const position = POSITIONS.find((position) => position.id === positionId);
        const type = TYPES.find((type) => type.id === position.betType);
        if (position.winners.includes(this.winner)) {
          const stake = this.bets[positionId];
          const winnings = type.payout * stake;
          const playerReturnValue = winnings + stake;

          // console.info(`Position ${positionId}  of type ${type} is a winner - ${stake} => ${playerReturnValue}`);

          this.player.win(playerReturnValue);
        }
      });
  }

  private getNumber(): Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(5); // lol
    });
  }

}

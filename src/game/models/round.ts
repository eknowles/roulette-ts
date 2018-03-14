import { POSITIONS } from '../constants/positions';
import { TYPES } from '../constants/types';
import { Player } from './player';

export interface IBet {
  [positionId: string]: number;
}

export class Round {
  public static ERROR_NO_FUNDS = 'No Funds Available';
  public createdAt: number;
  public bets: IBet;
  public winner: null | number;
  public player: Player;

  constructor(player: Player) {
    this.createdAt = Date.now();
    this.player = player;
    this.bets = {};
    this.winner = null;
  }

  public removePosition(positionId: string) {
    const amount = this.bets[positionId];

    if (!amount) {
      return;
    }

    this.player.returnBet(amount);
    delete this.bets[positionId];
  }

  public placeBet(amount: number, positionId: string) {
    if (this.player.bank < amount) {
      throw new Error(Round.ERROR_NO_FUNDS);
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

  /**
   * Get a random number between 0 and 36
   * @return {Promise<number>}
   */
  public getNumber(): Promise<number> {
    return new Promise((resolve, reject) => {
      resolve(5); // lol
    });
  }

  private processWin() {
    Object
      .keys(this.bets)
      .forEach((positionId) => {
        const position = POSITIONS.find((p) => p.id === positionId);
        const type = TYPES.find((t) => t.id === position.typeId);
        if (position.winners.includes(this.winner)) {
          const stake = this.bets[positionId];
          const winnings = type.payout * stake;
          const playerReturnValue = winnings + stake;

          // console.info(`Position ${positionId}  of type ${type} is a winner - ${stake} => ${playerReturnValue}`);

          this.player.win(playerReturnValue);
        }
      });
  }
}

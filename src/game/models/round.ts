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
      this.processWin(this.bets, this.winner);
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

  public processWin(bets: IBet, winner: number): void {
    const playerReturns = this.calculateBetReturns(bets, winner);

    if (playerReturns) {
      this.player.win(playerReturns);
    }
  }

  public calculateBetReturns(bets: IBet, winner: number) {
    return Object.keys(bets).reduce((accumulator: number, positionId: string) => {
      return accumulator + this.calculatePositionReturn(positionId, bets[positionId], winner);
    }, 0);
  }

  public calculatePositionReturn(positionId: string, originalStake: number, winningNumber: number): number {
    const position = POSITIONS.find((p) => p.id === positionId);
    const payout = TYPES.find((t) => t.id === position.typeId).payout;

    if (!position.winners.includes(winningNumber)) {
      return 0;
    }

    const winnings = originalStake * payout;

    return winnings + originalStake;
  }
}

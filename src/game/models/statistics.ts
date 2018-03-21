import { IPosition, POSITIONS } from '../constants/positions';

export interface IPositionStatistic {
  [positionId: string]: number; // count
}

/**
 * This class contains methods for summarising the previous round numbers and the positions that were winners
 */
export class Statistics {

  /**
   * Calculate the overall position statistics of winning numbers
   * @param {number[]} winningNumbers
   * @param {string} typeId
   * @return {IPositionStatistic}
   */
  public static getPositionCount(winningNumbers: number[], typeId?: string): IPositionStatistic {
    let positions = Object.values(POSITIONS);

    if (typeId) {
      positions = positions.filter((pos) => pos.typeId === typeId);
    }

    return positions.reduce((stats: IPositionStatistic, current: IPosition) => {
      stats[current.id] = winningNumbers.reduce((total: number, number: number) => {
        return current.winners.includes(number) ? total + 1 : total;
      }, 0);
      return stats;
    }, {});
  }
}

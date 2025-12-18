import { IPosition, POSITIONS } from "../constants/positions";
import { TYPES } from "../constants/types";

export interface IPositionStatistic {
  [positionId: string]: number; // count
}

/**
 * This class contains methods for summarising the previous round numbers and the positions that were winners
 */
export class Statistics {
  public static ERROR_BAD_TYPE_ID = "Bad typeId";

  /**
   * Calculate the overall position statistics of winning numbers
   * @param {number[]} winningNumbers
   * @param {string} typeId
   * @return {IPositionStatistic}
   */
  public static getPositionCount(
    winningNumbers: number[],
    typeId?: string,
  ): IPositionStatistic {
    if (typeId && !TYPES[typeId]) {
      throw new Error(Statistics.ERROR_BAD_TYPE_ID);
    }

    let positions = Object.values(POSITIONS);

    if (typeId) {
      positions = positions.filter((pos) => pos.typeId === typeId);
    }

    return positions.reduce((stats: IPositionStatistic, current: IPosition) => {
      stats[current.id] = winningNumbers.reduce(
        (total: number, number: number) => {
          return current.winners.includes(number) ? total + 1 : total;
        },
        0,
      );
      return stats;
    }, {});
  }
}

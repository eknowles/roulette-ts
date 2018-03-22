/**
 * The maximum value a player can deposit in one go
 * @type {number}
 */
export const MAX_DEPOSIT_VALUE = 10000;

/**
 * The minimum value a player can deposit
 * @type {number}
 */
export const MIN_DEPOSIT_VALUE = 1;

/**
 * The maximum total value of all positions that can be placed in a round
 * @type {number}
 */
export const MAX_OUTSIDE_BET_VALUE = 500;

/**
 * The maximum total value of all positions that can be placed in a round
 * @type {number}
 */
export const MIN_OUTSIDE_BET_VALUE = 5;

/**
 * The maximum total value of all positions that can be placed in a round
 * @type {number}
 */
export const MAX_INSIDE_BET_VALUE = 5000;

/**
 * Maximum value to place on a number at a time
 */
export const MAX_TYPE_BET_VALUE: { [typeId: string]: number } = {
  T_CORNER: 100,
  T_SIX_LINE: 150,
  T_SPLIT: 50,
  T_STRAIGHT_UP: 25,
  T_STREET: 75,
};

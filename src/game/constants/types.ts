/* tslint:disable:max-line-length object-literal-sort-keys */

export interface IType {
  /**
   * Unique ID of the type of bet
   */
  id: string;

  /**
   * If the bet is considered an inside bet
   */
  inside?: boolean;

  /**
   * If the bet is considered an outside bet
   */
  outside?: boolean;

  /**
   * Multiplier payout of bet value
   */
  payout: number;

  /**
   * Pretty name to be displayed to user
   */
  name: string;

  /**
   * Description of bet type
   */
  desc: string;
}

export const TYPES: {[typeId: string]: IType} = {
  T_ZERO: {id: 'T_ZERO', inside: true, payout: 35, name: '0', desc: '0'},
  T_DOUBLE_ZERO: {id: 'T_DOUBLE_ZERO', inside: true, payout: 35, name: '00', desc: '00'},
  T_STRAIGHT_UP: {id: 'T_STRAIGHT_UP', inside: true, payout: 35, name: 'Straight up', desc: 'Any single number'},
  T_ROW: {id: 'T_ROW', inside: true, payout: 17, name: 'Row', desc: '0, 00'},
  T_SPLIT: {id: 'T_SPLIT', inside: true, payout: 17, name: 'Split', desc: 'any two adjoining numbers vertical or horizontal'},
  T_STREET: {id: 'T_STREET', inside: true, payout: 11, name: 'Street', desc: 'any three numbers horizontal (1, 2, 3 or 4, 5, 6, etc.)'},
  T_CORNER: {id: 'T_CORNER', inside: true, payout: 8, name: 'Corner', desc: 'any four adjoining numbers in a block (1, 2, 4, 5 or 17, 18, 20, 21, etc.)'},
  T_BASKET: {id: 'T_BASKET', inside: true, payout: 11, name: 'Top line or Basket', desc: '0, 1, 2, 3'},
  T_SIX_LINE: {id: 'T_SIX_LINE', inside: true, payout: 5, name: 'Six line', desc: 'any six numbers from two horizontal rows (1, 2, 3, 4, 5, 6 or 28, 29, 30, 31, 32, 33 etc.)'},
  T_1ST_COLUMN: {id: 'T_1ST_COLUMN', outside: true, payout: 2, name: '1st column', desc: '1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34'},
  T_2ND_COLUMN: {id: 'T_2ND_COLUMN', outside: true, payout: 2, name: '2nd column', desc: '2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35'},
  T_3RD_COLUMN: {id: 'T_3RD_COLUMN', outside: true, payout: 2, name: '3rd column', desc: '3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36'},
  T_1ST_DOZEN: {id: 'T_1ST_DOZEN', outside: true, payout: 2, name: '1st dozen', desc: '1 through 12'},
  T_2ND_DOZEN: {id: 'T_2ND_DOZEN', outside: true, payout: 2, name: '2nd dozen', desc: '13 through 24'},
  T_3RD_DOZEN: {id: 'T_3RD_DOZEN', outside: true, payout: 2, name: '3rd dozen', desc: '25 through 36'},
  T_ODD: {id: 'T_ODD', outside: true, payout: 1, name: 'Odd', desc: '1, 3, 5, ..., 35'},
  T_EVEN: {id: 'T_EVEN', outside: true, payout: 1, name: 'Even', desc: '2, 4, 6, ..., 36'},
  T_RED: {id: 'T_RED', outside: true, payout: 1, name: 'Red', desc: '1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36'},
  T_BLACK: {id: 'T_BLACK', outside: true, payout: 1, name: 'Black', desc: '2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35'},
  T_1_TO_18: {id: 'T_1_TO_18', outside: true, payout: 1, name: '1 to 18', desc: '1, 2, 3, ..., 18'},
  T_19_TO_36: {id: 'T_19_TO_36', outside: true, payout: 1, name: '19 to 36', desc: '19, 20, 21, ..., 36'},
};

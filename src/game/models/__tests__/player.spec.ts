import { Player } from '../player';

describe('Class', () => {
  describe('Player', () => {
    describe('constructor', () => {
      const name = 'test';
      const player = new Player(name);

      it('should set players name with the first param', () => {
        expect(player.name).toEqual(name);
      });
      it('should set the bank property to 0', () => {
        expect(player.bank).toBe(0);
      });
    });

    describe('static validateAmount()', () => {
      it('should throw error if amount is less than 1', () => {
        expect(() => Player.validateAmount(0)).toThrowError(Player.ERROR_NEGATIVE_AMOUNT);
      });
      it('should throw error if amount is a float', () => {
        expect(() => Player.validateAmount(10.5)).toThrowError(Player.ERROR_FLOAT_AMOUNT);
      });
    });

    describe('deposit()', () => {
      let player;
      beforeEach(() => {
        player = new Player();
      });
      it('should validate the amount', () => {
        const amount = 100;
        Player.validateAmount = jest.fn();
        player.deposit(amount);
        expect(Player.validateAmount).toHaveBeenCalledWith(amount);
      });
      it('should increase the players bank by the given amount', () => {
        const amount = 100;
        player.bank = 0; // hard reset
        player.deposit(amount);
        expect(player.bank).toBe(amount);
      });
    });

    describe('bet()', () => {
      let player;
      beforeEach(() => {
        player = new Player();
      });
      it('should validate the amount', () => {
        const amount = 100;
        Player.validateAmount = jest.fn();
        player.bet(amount);
        expect(Player.validateAmount).toHaveBeenCalledWith(amount);
      });
      it('should decrease the players bank by the given amount', () => {
        const amount = 100;
        player.bank = 0; // hard reset
        player.bet(amount);
        expect(player.bank).toBe(-amount);
      });
    });

    describe('win()', () => {
      let player;
      beforeEach(() => {
        player = new Player();
      });
      it('should increase the players bank by the given amount', () => {
        const amount = 100;
        player.bank = 0; // hard reset
        player.win(amount);
        expect(player.bank).toBe(amount);
      });
    });

    describe('returnBet()', () => {
      let player;
      beforeEach(() => {
        player = new Player();
      });
      it('should increase the players bank by the given amount', () => {
        const amount = 100;
        player.bank = 0; // hard reset
        player.returnBet(amount);
        expect(player.bank).toBe(amount);
      });
    });
  });
});

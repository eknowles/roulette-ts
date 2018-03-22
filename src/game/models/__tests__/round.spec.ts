import { Player } from '../player';
import { Round } from '../round';

describe('Class', () => {
  describe('Round', () => {
    const player = new Player('test');

    describe('constructor', () => {
      it('should set winner to null', () => {
        expect((new Round(player)).winner).toBe(null);
      });
      it('should set player to first argument', () => {
        expect((new Round(player)).player).toBe(player);
      });
      it('should set bets to an empty object', () => {
        const bets = (new Round(player)).bets;
        expect(bets).toBeDefined();
        expect(bets instanceof Object).toBeTruthy();
      });
    });

    describe('removePosition()', () => {
      it('should return undefined if no amount placed on position', () => {
        const round = new Round(player);
        expect(round.removePosition('')).toBe(undefined);
      });
      it('should delete key from bets', () => {
        const round = new Round(player);
        const amount = 10;
        const positionId = 'foo';
        round.bets = {[positionId]: amount};
        round.removePosition(positionId);
        expect(round.bets[positionId]).not.toBeDefined();
      });
      it('should delete key from bets', () => {
        const round = new Round(player);
        const amount = 10;
        const positionId = 'foo';
        round.player.returnBet = jest.fn();
        round.bets = {[positionId]: amount};
        round.removePosition(positionId);
        expect(round.player.returnBet).toHaveBeenCalledWith(amount);
      });
    });

    describe('placeBet()', () => {
      it('should throw error if amount is greater than players bank', () => {
        const positionId = 'P_1';
        const amount = 10;
        const round = new Round(player);
        const action = () => round.placeBet(amount, positionId);

        round.player.bank = 0;
        expect(action).toThrowError(Round.ERROR_NO_FUNDS);
      });
      it('should insert key into bets object with amount as value', () => {
        const positionId = 'P_1';
        const amount = 10;
        const round = new Round(player);

        round.bets = {}; // hard reset bets
        round.player.bank = amount; // ensure player has enough credit
        round.placeBet(amount, positionId);
        expect(round.bets[positionId]).toBe(amount);
      });
      it('should update bets value if already exists', () => {
        const positionId = 'P_1';
        const amount = 10;
        const round = new Round(player);

        round.bets = {[positionId]: amount}; // set foo: 10
        round.player.bank = amount; // ensure player has enough credit
        round.placeBet(amount, positionId); // bet another 10 credits
        expect(round.bets[positionId]).toBe(amount + amount);
      });
      it('should update bets value if already exists', () => {
        const positionId = 'P_1';
        const amount = 10;
        const round = new Round(player);

        round.player.bank = amount; // ensure player has enough credit
        round.player.bet = jest.fn();
        round.placeBet(amount, positionId); // bet another 10 credits
        expect(round.player.bet).toHaveBeenCalledWith(amount);
      });
      it('should throw error when given an invalid positionId', () => {
        const fn = () => (new Round(player)).placeBet(10, 'foo');
        expect(fn).toThrowError(Round.ERROR_BAD_POSITION_ID);
      });
    });

    describe('run()', () => {
      let round;
      let winningNumber;

      beforeEach(() => {
        round = new Round(player);
        winningNumber = 10;

        round.getNumber = jest.fn().mockReturnValue(Promise.resolve(winningNumber));
        round.processWin = jest.fn();
        round.run();
      });
      it('should call getNumber and set the winner to the response', () => {
        expect(round.getNumber).toHaveBeenCalledTimes(1);
      });
      it('should set a winner', () => {
        expect(round.winner).toBe(winningNumber);
      });
      it('should call processWin()', () => {
        expect(round.processWin).toHaveBeenCalledTimes(1);
      });
    });

    describe('getNumber()', () => {
      it('should return a number', () => {
        (new Round(player)).getNumber().then((number) => {
          expect(number).toBeDefined();
          expect(typeof number).toBe('number');
        });
      });
    });

    describe('processWin()', () => {
      let round;

      beforeEach(() => {
        round = new Round(player);
        round.player.win = jest.fn();
      });

      it('should update the player if placed a winning bet', () => {
        round.processWin({P_ZERO: 1}, 0);
        expect(round.player.win).toHaveBeenCalledWith(36);
      });

      it('should do nothing if player does not win', () => {
        round.processWin({P_ZERO: 1}, 1);
        expect(round.player.win).not.toHaveBeenCalled();
      });
    });

    describe('calculatePositionReturn()', () => {
      it('should update the player if placed a winning bet', () => {
        const expected = (new Round(player)).calculatePositionReturn('P_ZERO', 1, 0);

        expect(expected).toBe(36);
      });
    });
  });
});

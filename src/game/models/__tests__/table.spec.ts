import { Player } from '../player';
import { Round } from '../round';
import { Table } from '../table';

describe('Class', () => {
  describe('Table', () => {
    const player = new Player();

    describe('constructor', () => {
      it('should set the property player to the first argument', () => {
        const table = new Table(player);
        expect(table.player).toBe(player);
      });
      it('should set the currentSpin to an instance of Round', () => {
        const table = new Table(player);
        expect(table.currentSpin instanceof Round).toBeTruthy();
      });
      it('should set previousSpins to an empty array', () => {
        const table = new Table(player);
        expect(table.previousSpins).toBeDefined();
        expect(table.previousSpins.length).toBe(0);
      });
    });

    describe('newSpin()', () => {
      it('should ...', () => {
        // todo add tests
      });
    });

    describe('processWin()', () => {
      it('should ...', () => {
        // todo add tests
      });
    });

    describe('getNumber()', () => {
      it('should ...', () => {
        // todo add tests
      });
    });

    describe('run()', () => {
      it('should ...', () => {
        // todo add tests
      });
    });
  });
});

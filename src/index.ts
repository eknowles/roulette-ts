import { GameModel } from './models/game.model';

const game = new GameModel();

// deposit money
game.table.player.deposit(5000);

// place bets
game.table.currentSpin.placeBet(100, 'P_RED');
game.table.currentSpin.placeBet(100, 'P_1_TO_18');

// spin wheel
game.table.currentSpin.run();

// start a new spin
game.table.newSpin();

console.dir(game);


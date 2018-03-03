import * as THREE from 'three';

import { GameModel } from './game/models/game.model';
import { App } from './ui/app';

// require('style/main.scss');

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

const app = new App();

window.scene = app.scene;
window.THREE = THREE;

import { Game } from './game';
import { App } from './ui/app';

import * as THREE from 'three';

import './style/main.scss';

const game = new Game();

// deposit money
game.table.player.deposit(5000);

// place bets
game.table.currentSpin.placeBet(100, 'P_RED');
game.table.currentSpin.placeBet(100, 'P_1_TO_18');

// spin wheel
game.table.currentSpin.run();

// start a new spin
game.table.newSpin();

const settings = {
  drawHelpers: false,
  highQuality: true,
};

const app = new App('world', settings);

window.THREE = THREE;
window.scene = app.scene;
window.app = app;

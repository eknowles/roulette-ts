import { Game } from './game';
import { App } from './ui/app';

import * as THREE from 'three';

import './style/main.scss';
import { POSITIONS } from "./game/constants/positions";

const game = new Game();

// deposit money
game.table.player.deposit(5000);

// place bets
game.table.currentSpin.placeBet(100, POSITIONS.P_RED.id);
game.table.currentSpin.placeBet(100, POSITIONS.P_1_TO_18.id);

// spin wheel
game.table.currentSpin.run();

// start a new spin
game.table.newSpin();

const settings = {
  drawHelpers: true,
  highQuality: true,
};

const app = new App('world', settings);

window.THREE = THREE;
window.scene = app.scene;
window.app = app;

"use strict";
import { Game } from './classes/game.js';

// Audio //

// const hitSound = new Audio(
//   "music/julien_matthey_impact_snowball_on_cement_002.mp3"
// );
// function startHitSound() {
//   hitSound.play();
// }
// const throwSound = new Audio(
//   "music/zapsplat_sport_rugby_ball_throw_pass_let_go_001_67491.mp3"
// );
// function startThrowSound() {
//   throwSound.play();
// }
// const hurtSound = new Audio("music/zapsplat_human_male_gasp_001_19848.mp3");
// function startHurtSound() {
//   hurtSound.play();
// }

// let colors: string[] = [
//   "Chartreuse",
//   "Crimson",
//   "Cyan",
//   "DarkGoldenRod",
//   "DeepPink",
//   "DodgerBlue",
//   "Fuchsia",
//   "Gold",
//   "Indigo",
//   "Aqua",
//   "Aquamarine",
//   "BlueViolet",
//   "Ivory",
// ];

(window as any).game = new Game(9, 38, 10, 100, window.innerWidth, window.innerHeight, "");
// let game2 = new Game(9, 38, 10, 100, window.innerWidth / 2, window.innerHeight, 0)



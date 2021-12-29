"use strict";
import { Player } from './classes/player.js';
import { Obstacle } from './classes/obstacle.js';
import { Camera } from './classes/camera.js';
import { Vector } from './classes/vector.js';
import { Game } from './classes/game.js';
import { Snowball } from './classes/snowball.js';
export const canvas = document.getElementById("myCanvas");
export const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Audio //
// var backgroundMusic = new Audio("music/music_zapsplat_winter_dance.mp3");
// function startBackgroundMusic() {
//   backgroundMusic.play();
//   backgroundMusic.loop = true;
//   backgroundMusic.volume = 0.1;
// }
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
let colors = [
    "Chartreuse",
    "Crimson",
    "Cyan",
    "DarkGoldenRod",
    "DeepPink",
    "DodgerBlue",
    "Fuchsia",
    "Gold",
    "Indigo",
    "Aqua",
    "Aquamarine",
    "BlueViolet",
    "Ivory",
];
let username = prompt("Enter your username");
let numPlayers = 4;
let playerRadius = 38;
export let snowballRadius = 10;
export let myIndex = 0;
export const pCanvas = document.createElement("canvas");
pCanvas.width = playerRadius * 2;
pCanvas.height = playerRadius * 2;
export const pctx = pCanvas.getContext("2d");
let pictures = [];
pictures.push("player images/PLAYER1.png");
pictures.push("player images/PLAYER2.png");
pictures.push("player images/PLAYER3.png");
pictures.push("player images/PLAYER4.png");
pictures.push("player images/PLAYER5.png");
pictures.push("player images/PLAYER6.png");
pictures.push("player images/PLAYER8.png");
pictures.push("player images/PLAYER9.png");
pictures.push("player images/PLAYER10.png");
pictures.push("player images/PLAYER11.png");
pictures.push("player images/PLAYER12.png");
pictures.push("player images/PLAYER13.png");
pictures.push("player images/PLAYER14.png");
for (let i = 0; i < numPlayers; i++) {
    let img = document.createElement("img");
    let randomPic = Math.floor(Math.random() * pictures.length);
    img.src = pictures[randomPic];
    Game.players.push(new Player(username, new Vector(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)), colors[i], 100, 100, img, playerRadius));
}
let images = [];
images.push("obstacle images/TREES.png");
images.push("obstacle images/TREES1.png");
images.push("obstacle images/TREES2.png");
images.push("obstacle images/TREES3.png");
images.push("obstacle images/TREES4.png");
images.push("obstacle images/TREES6.png");
images.push("obstacle images/TREES7.png");
images.push("obstacle images/TREES8.png");
let numObstacles = 100;
for (let i = 0; i < numObstacles; i++) {
    let p = new Vector(Math.floor(Math.random() * 5000), Math.floor(Math.random() * 5000));
    let img = document.createElement("img");
    let indexImage = Math.floor(Math.random() * images.length);
    img.src = images[indexImage];
    let o = new Obstacle(p, 50 + Math.random() * 50, "lightblue", img);
    Game.obstacles.push(o);
}
requestAnimationFrame(Game.cycle);
export function hypo(adjacent, opposite) {
    return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
}
export function distanceBetween(a, b) {
    return hypo(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
}
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMovement);
export let mouseBtnDown = false;
let isAiming = false;
function mouseDown(_e) {
    const p = Game.players[0];
    // startBackgroundMusic();
    if (distanceBetween(p.position, p.target) < 40) {
        isAiming = true;
        mouseBtnDown = true;
    }
    else {
        p.runToPoint(p.target);
    }
}
function mouseUp(_e) {
    const p = Game.players[0];
    if (isAiming) {
        p.snowballs.push(new Snowball(p.position, p.target.subtract(p.position).normalise().multiply(5)));
        // startThrowSound();
    }
    mouseBtnDown = false;
    isAiming = false;
}
function mouseMovement(e) {
    let p = Game.players[0];
    p.target = new Vector(e.clientX + Camera.focus.x - canvas.width / 2, e.clientY + Camera.focus.y - canvas.height / 2);
}
//# sourceMappingURL=script.js.map
import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { Camera } from './camera.js';
import { Vector } from './vector.js';
import { Snowball } from './snowball.js';
export class Game {
    constructor(numPlayers, playerRadius, snowballRadius, numObstacles, width, height, myIndex) {
        this.players = [];
        this.obstacles = [];
        this.mouseBtnDown = false;
        this.isAiming = false;
        this.numPlayers = numPlayers;
        this.playerRadius = playerRadius;
        this.snowballRadius = snowballRadius;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.canvas.width = width;
        this.canvas.height = height;
        this.pCanvas = document.createElement("canvas");
        this.pCanvas.width = playerRadius * 2;
        this.pCanvas.height = playerRadius * 2;
        this.pctx = this.pCanvas.getContext("2d");
        this.myIndex = myIndex;
        this.setupPlayers(this.numPlayers, this.playerRadius);
        this.setupObstacles(numObstacles);
        this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouseMovement(e));
        requestAnimationFrame(() => this.cycle());
    }
    cycle() {
        var _a, _b;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.resetTransform();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Camera.update(this.players[0].position, this);
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];
            p.draw(this);
            p.move();
            p.drawAndMoveSnowballs(this);
            p.drawHealth(this);
            p.checkSnowballs(this);
            p.drawUsername(this);
            p.movePlayerAroundObstacles(this);
            while (p.pushOtherPlayersAway(this)) { }
            p.ghostMode();
            if (Vector.distanceBetween(p.position, p.destination) < 50 && this.mouseBtnDown == true) {
                p.drawAimLine(this);
                p.velocity.x = 0;
                p.velocity.y = 0;
            }
            else if (Vector.distanceBetween(p.position, p.destination) < 20) {
                p.velocity.x = 0;
                p.velocity.y = 0;
            }
        }
        this.drawObstacles();
        requestAnimationFrame(() => this.cycle());
    }
    drawObstacles() {
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw(this);
        }
    }
    setupPlayers(numPlayers, playerRadius) {
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
            this.players.push(new Player("player", new Vector(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)), 100, 100, img, playerRadius));
        }
    }
    setupObstacles(numObstacles) {
        let images = [];
        images.push("obstacle images/TREES.png");
        images.push("obstacle images/TREES1.png");
        images.push("obstacle images/TREES2.png");
        images.push("obstacle images/TREES3.png");
        images.push("obstacle images/TREES4.png");
        images.push("obstacle images/TREES6.png");
        images.push("obstacle images/TREES7.png");
        images.push("obstacle images/TREES8.png");
        for (let i = 0; i < numObstacles; i++) {
            let p = new Vector(Math.floor(Math.random() * 5000), Math.floor(Math.random() * 5000));
            let img = document.createElement("img");
            let indexImage = Math.floor(Math.random() * images.length);
            img.src = images[indexImage];
            let o = new Obstacle(p, 50 + Math.random() * 50, "lightblue", img);
            this.obstacles.push(o);
        }
    }
    mouseDown(_e) {
        const p = this.players[0];
        // startBackgroundMusic();
        console.log("x");
        if (Vector.distanceBetween(p.position, p.target) < 40) {
            this.isAiming = true;
            this.mouseBtnDown = true;
        }
        else {
            p.runToPoint(p.target);
        }
    }
    mouseUp(_e) {
        const p = this.players[0];
        if (this.isAiming) {
            p.snowballs.push(new Snowball(p.position, p.target.subtract(p.position).normalise().multiply(5)));
            // startThrowSound();
        }
        this.mouseBtnDown = false;
        this.isAiming = false;
    }
    mouseMovement(e) {
        let p = this.players[0];
        p.target = new Vector(e.clientX + Camera.focus.x - this.canvas.width / 2, e.clientY + Camera.focus.y - this.canvas.height / 2);
    }
}
//# sourceMappingURL=game.js.map
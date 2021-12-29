var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { Camera } from './camera.js';
import { Vector } from './vector.js';
import { Snowball } from './snowball.js';
import { fetchObject, endpoint } from './client.js';
export class Game {
    constructor(numPlayers, playerRadius, snowballRadius, numObstacles, width, height, myName) {
        this.id = 0;
        this.players = {};
        this.obstacles = [];
        this.mouseBtnDown = false;
        this.isAiming = false;
        this.pictures = [];
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
        this.myName = myName;
        // this.setupPlayers(this.numPlayers, this.playerRadius)
        this.setupObstacles(numObstacles);
        this.setupPictures();
        this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.mouseMovement(e));
        requestAnimationFrame(() => this.cycle());
    }
    cycle() {
        var _a, _b;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.resetTransform();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.players.length) {
            Camera.update(this.players[0].position, this);
        }
        // for (let i = 0; i < this.players.length; i++) 
        for (let pName in this.players) {
            const p = this.players[pName];
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
    setupPictures() {
        this.pictures.push("player images/PLAYER1.png");
        this.pictures.push("player images/PLAYER2.png");
        this.pictures.push("player images/PLAYER3.png");
        this.pictures.push("player images/PLAYER4.png");
        this.pictures.push("player images/PLAYER5.png");
        this.pictures.push("player images/PLAYER6.png");
        this.pictures.push("player images/PLAYER8.png");
        this.pictures.push("player images/PLAYER9.png");
        this.pictures.push("player images/PLAYER10.png");
        this.pictures.push("player images/PLAYER11.png");
        this.pictures.push("player images/PLAYER12.png");
        this.pictures.push("player images/PLAYER13.png");
        this.pictures.push("player images/PLAYER14.png");
    }
    setupPlayers(numPlayers, playerRadius) {
        for (let i = 0; i < numPlayers; i++) {
            let img = document.createElement("img");
            let randomPic = Math.floor(Math.random() * this.pictures.length);
            img.src = this.pictures[randomPic];
            let pName = "player " + i;
            this.players[pName] = (new Player(pName, new Vector(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)), 100, 100, img, playerRadius));
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
        if (this.players.length) {
            const p = this.players[0];
            // startBackgroundMusic();
            if (Vector.distanceBetween(p.position, p.target) < 40) {
                this.isAiming = true;
                this.mouseBtnDown = true;
            }
            else {
                p.runToPoint(p.target);
            }
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
        if (this.players.length) {
            let p = this.players[0];
            p.target = new Vector(e.clientX + Camera.focus.x - this.canvas.width / 2, e.clientY + Camera.focus.y - this.canvas.height / 2);
        }
    }
    addPlayer(playerName, position) {
        let img = document.createElement("img");
        img.src = this.pictures[Object.keys(this.players).length % this.pictures.length];
        console.log("img.src" + img.src);
        this.players[playerName] = new Player(playerName, position, 100, 100, img, this.playerRadius);
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.myName = document.getElementById("playerName").value;
            let cmd = { cmd: "createGame", playerName: this.myName };
            let gameInfo = yield fetchObject(endpoint, cmd);
            // processMsgs(msgs)
            this.id = gameInfo.gameId; //we now know which game WE have joined (the creator)
            document.getElementById("gameToShare").value = this.id.toString();
            // joinGame(this.id)
        });
    }
}
//# sourceMappingURL=game.js.map
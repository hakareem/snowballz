import { Vector } from './vector.js';
import { Snowball } from './snowball.js';
export class Player {
    constructor(username, position, hp, hpMax, img, radius) {
        this.username = "";
        this.position = new Vector(50, 50);
        this.velocity = new Vector(0, 0); // the direction the player is currently moving in
        this.destination = new Vector(0, 0);
        this.direction = new Vector(0, 0); // the last direction this player was known to be running in
        this.snowballs = [];
        this.angle = 0; // rotation angle of the player(for drawing)
        this.target = new Vector(0, 0); // populate that during mouse movement
        this.hp = 0;
        this.hpMax = 0;
        this.username = username;
        this.position = position;
        this.destination = this.position;
        this.hp = hp;
        this.hpMax = hpMax;
        this.img = img;
        this.radius = radius;
    }
    drawHealth(game) {
        var _a, _b, _c, _d, _e, _f;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.save();
        (_b = game.ctx) === null || _b === void 0 ? void 0 : _b.translate(this.position.x, this.position.y);
        (_c = game.ctx) === null || _c === void 0 ? void 0 : _c.scale(1, -1);
        game.ctx.fillStyle = "red";
        let width = (60 * this.hp) / this.hpMax;
        if (width < 0) {
            width = 0;
        }
        (_d = game.ctx) === null || _d === void 0 ? void 0 : _d.fillRect(-30, 30, width, 10);
        game.ctx.strokeStyle = "black";
        (_e = game.ctx) === null || _e === void 0 ? void 0 : _e.strokeRect(-30, 30, 60, 10);
        (_f = game.ctx) === null || _f === void 0 ? void 0 : _f.restore();
    }
    drawUsername(game) {
        var _a;
        game.ctx.textAlign = "center";
        game.ctx.font = "25px Arial";
        game.ctx.fillStyle = "black";
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.fillText(this.username, this.position.x + 5, this.position.y + 50);
    }
    draw(game) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.save();
        let r = this.radius; //*1.4
        //game.pctx is s second canvas/context we use to pre-rotate the player
        (_b = game.pctx) === null || _b === void 0 ? void 0 : _b.save();
        (_c = game.pctx) === null || _c === void 0 ? void 0 : _c.clearRect(0, 0, r * 2, r * 2);
        (_d = game.pctx) === null || _d === void 0 ? void 0 : _d.translate(r, r);
        (_e = game.pctx) === null || _e === void 0 ? void 0 : _e.rotate(this.angle);
        (_f = game.pctx) === null || _f === void 0 ? void 0 : _f.translate(-r, -r);
        (_g = game.pctx) === null || _g === void 0 ? void 0 : _g.drawImage(this.img, r * .2, r * .2, r * 1.8, r * 1.8);
        (_h = game.pctx) === null || _h === void 0 ? void 0 : _h.restore();
        game.ctx.translate(this.position.x, this.position.y);
        (_j = game.ctx) === null || _j === void 0 ? void 0 : _j.drawImage(game.pCanvas, -r, -r, r * 2, r * 2);
        (_k = game.ctx) === null || _k === void 0 ? void 0 : _k.restore();
    }
    move() {
        this.position = this.position.add(this.velocity);
    }
    drawAndMoveSnowballs(game) {
        for (let i = 0; i < this.snowballs.length; i++) {
            if (this.snowballs[i].active) {
                this.snowballs[i].move();
                this.snowballs[i].draw(game);
            }
        }
    }
    drawAimLine(game) {
        var _a, _b, _c, _d;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = game.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(this.target.x, this.target.y);
        (_c = game.ctx) === null || _c === void 0 ? void 0 : _c.lineTo(this.position.x, this.position.y);
        game.ctx.strokeStyle = "black";
        game.ctx.lineWidth = 2;
        (_d = game.ctx) === null || _d === void 0 ? void 0 : _d.stroke();
    }
    runToPoint(destination) {
        let p = this;
        p.destination = destination;
        // Do nothing if we are already at the point, otherwise we would get an division by 0 error
        if (Vector.distanceBetween(p.position, p.destination) < 0.01) {
            return;
        }
        let adjacent = p.destination.x - p.position.x;
        let opposite = p.destination.y - p.position.y;
        p.angle = -Math.atan2(-opposite, adjacent) - Math.PI / 2;
        let hypotenuse = Vector.hypo(adjacent, opposite);
        p.velocity.x = (adjacent / hypotenuse) * 5;
        p.velocity.y = (opposite / hypotenuse) * 5;
        p.direction = new Vector(p.velocity.x, p.velocity.y);
    }
    shootSnowball(target, game) {
        const p = game.players[0];
        const mouseCoord = new Vector(target.x, target.y);
        if (Vector.distanceBetween(mouseCoord, p.position) <= 20) {
            p.snowballs.push(new Snowball(p.position, p.direction));
        }
    }
    pushOtherPlayersAway(game) {
        let isOverlap = false;
        // for (let i = 0; i < game.players.length; i++) 
        for (let pName in game.players) {
            const otherPlayer = game.players[pName];
            if (otherPlayer != this) {
                let dbt = Vector.distanceBetween(this.position, otherPlayer.position);
                if (dbt < 0.01) {
                    otherPlayer.position.x += 2;
                }
                let overlap = 60 - dbt;
                if (overlap > 0) {
                    isOverlap = true;
                    let vectorBetween = this.position.subtract(otherPlayer.position);
                    let directionBetween = vectorBetween.normalise();
                    otherPlayer.position = otherPlayer.position.subtract(directionBetween.multiply(overlap + 1));
                }
            }
        }
        return isOverlap;
    }
    movePlayerAroundObstacles(game) {
        for (let i = 0; i < game.obstacles.length; i++) {
            const obstacle = game.obstacles[i];
            let dbt = Vector.distanceBetween(this.position, obstacle.position);
            let overlap = obstacle.radius * 1.7 - dbt;
            if (overlap > 0) {
                let vectorBetween = this.position.subtract(obstacle.position);
                let directionBetween = vectorBetween.normalise();
                this.position = this.position.add(directionBetween.multiply(overlap));
                this.runToPoint(this.destination);
            }
        }
    }
    checkSnowballs(game) {
        for (let s = 0; s < this.snowballs.length; s++) {
            let snowball = this.snowballs[s];
            if (snowball.active == true) {
                snowball.checkAgainstPlayers(game);
                snowball.checkAgainstObstacles(game);
            }
        }
    }
    ghostMode() {
        if (this.hp <= 0) {
            this.runToPoint(new Vector(0, 0));
        }
    }
}
//# sourceMappingURL=player.js.map
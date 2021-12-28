import { Vector } from './vector.js';
import { Snowball } from './snowball.js';
import { Game } from './game.js';
import { distanceBetween, ctx, pctx, pCanvas, hypo } from '../script.js';
export class Player {
    constructor(username, position, color, hp, hpMax, img, radius) {
        this.username = "";
        this.position = new Vector(50, 50);
        this.velocity = new Vector(0, 0); // the direction the player is currently moving in
        this.destination = new Vector(0, 0);
        this.direction = new Vector(0, 0); // the last direction this player was known to be running in
        this.snowballs = [];
        this.angle = 0; // rotation angle of the player(for drawing)
        this.color = "";
        this.target = new Vector(0, 0); // populate that during mouse movement
        this.hp = 0;
        this.hpMax = 0;
        this.username = username;
        this.position = position;
        this.destination = this.position;
        this.color = color;
        this.hp = hp;
        this.hpMax = hpMax;
        this.img = img;
        this.radius = radius;
    }
    drawHealth() {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        ctx === null || ctx === void 0 ? void 0 : ctx.translate(this.position.x, this.position.y);
        ctx.fillStyle = "red";
        let width = (60 * this.hp) / this.hpMax;
        if (width < 0) {
            width = 0;
        }
        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(-28, 30, width, 10);
        ctx.strokeStyle = "black";
        ctx === null || ctx === void 0 ? void 0 : ctx.strokeRect(-28, 30, 60, 10);
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    }
    drawUsername() {
        ctx.textAlign = "center";
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx === null || ctx === void 0 ? void 0 : ctx.fillText(this.username, this.position.x, this.position.y);
    }
    draw() {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        let r = this.radius; //*1.4
        //pctx is s second canvas/context we use to pre-rotate the player
        pctx === null || pctx === void 0 ? void 0 : pctx.save();
        pctx === null || pctx === void 0 ? void 0 : pctx.clearRect(0, 0, r * 2, r * 2);
        pctx === null || pctx === void 0 ? void 0 : pctx.translate(r, r);
        pctx === null || pctx === void 0 ? void 0 : pctx.rotate(this.angle);
        pctx === null || pctx === void 0 ? void 0 : pctx.translate(-r, -r);
        pctx === null || pctx === void 0 ? void 0 : pctx.drawImage(this.img, r * .2, r * .2, r * 1.8, r * 1.8);
        pctx === null || pctx === void 0 ? void 0 : pctx.restore();
        ctx.translate(this.position.x, this.position.y);
        //  ctx?.beginPath();
        //  ctx?.arc(0, 0, this.radius, 0, Math.PI * 2);
        //  ctx!.fillStyle = this.color;
        //  ctx?.fill();
        //  ctx?.stroke();
        // ctx?.closePath;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(pCanvas, -r, -r, r * 2, r * 2);
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    }
    move() {
        this.position = this.position.add(this.velocity);
    }
    drawAndMoveSnowballs() {
        for (let i = 0; i < this.snowballs.length; i++) {
            if (this.snowballs[i].active) {
                this.snowballs[i].move();
                this.snowballs[i].draw();
            }
        }
    }
    drawAimLine() {
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(this.target.x, this.target.y);
        ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(this.position.x, this.position.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    }
    runToPoint(destination) {
        let p = Game.players[0];
        p.destination = destination;
        // Do nothing if we are already at the point, otherwise we would get an division by 0 error
        if (distanceBetween(p.position, p.destination) < 0.01) {
            return;
        }
        let adjacent = p.destination.x - p.position.x;
        let opposite = p.destination.y - p.position.y;
        p.angle = -Math.atan2(-opposite, adjacent) - Math.PI / 2;
        let hypotenuse = hypo(adjacent, opposite);
        p.velocity.x = (adjacent / hypotenuse) * 5;
        p.velocity.y = (opposite / hypotenuse) * 5;
        p.direction = new Vector(p.velocity.x, p.velocity.y);
    }
    shootSnowball(target) {
        const p = Game.players[0];
        const mouseCoord = new Vector(target.x, target.y);
        if (distanceBetween(mouseCoord, p.position) <= 20) {
            p.snowballs.push(new Snowball(p.position, p.direction));
        }
    }
    pushOtherPlayersAway() {
        let isOverlap = false;
        for (let i = 0; i < Game.players.length; i++) {
            const otherPlayer = Game.players[i];
            if (otherPlayer != this) {
                let dbt = distanceBetween(this.position, otherPlayer.position);
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
    movePlayerAroundObstacles() {
        for (let i = 0; i < Game.obstacles.length; i++) {
            const obstacle = Game.obstacles[i];
            let dbt = distanceBetween(this.position, obstacle.position);
            let overlap = obstacle.radius * 2 - dbt;
            // let isObstacle = false
            if (overlap > 0) {
                // isObstacle = true
                let vectorBetween = this.position.subtract(obstacle.position);
                let directionBetween = vectorBetween.normalise();
                this.position = this.position.add(directionBetween.multiply(overlap));
                // if (isObstacle) {
                this.runToPoint(this.destination);
                // }
            }
        }
    }
    checkSnowballs() {
        for (let s = 0; s < this.snowballs.length; s++) {
            let snowball = this.snowballs[s];
            if (snowball.active == true) {
                snowball.checkAgainstPlayers();
                snowball.checkAgainstObstacles();
            }
        }
    }
}
//# sourceMappingURL=player.js.map
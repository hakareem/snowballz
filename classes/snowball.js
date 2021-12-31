import { Vector } from './vector.js';
import { Sound } from './sounds.js';
export class Snowball {
    constructor(position, velocity) {
        this.color = "";
        this.size = 0;
        this.distance = 0;
        this.active = true;
        this.position = position;
        this.velocity = velocity;
    }
    draw(game) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.save();
        (_b = game.ctx) === null || _b === void 0 ? void 0 : _b.translate(this.position.x, this.position.y);
        (_c = game.ctx) === null || _c === void 0 ? void 0 : _c.beginPath();
        (_d = game.ctx) === null || _d === void 0 ? void 0 : _d.arc(0, 0, 8, 0, Math.PI * 2);
        (_e = game.ctx) === null || _e === void 0 ? void 0 : _e.stroke();
        game.ctx.fillStyle = "lightblue";
        (_f = game.ctx) === null || _f === void 0 ? void 0 : _f.fill();
        (_g = game.ctx) === null || _g === void 0 ? void 0 : _g.closePath;
        (_h = game.ctx) === null || _h === void 0 ? void 0 : _h.restore();
    }
    move() {
        this.position = this.position.add(this.velocity);
    }
    checkAgainstPlayers(game, owner) {
        // for (let i = 0; i < game.players.length; i++)
        for (let pName in game.players) {
            const p = game.players[pName];
            if (p != owner) {
                let playerToSnowball = Vector.distanceBetween(p.position, this.position);
                if (playerToSnowball < p.radius + game.snowballRadius) {
                    this.active = false;
                    p.hp -= 10;
                    Sound.play('playerGasp', 0.5);
                }
            }
        }
    }
    checkAgainstObstacles(game) {
        for (let i = 0; i < game.obstacles.length; i++) {
            const obstacle = game.obstacles[i];
            let snowballToObstacle = Vector.distanceBetween(obstacle.position, this.position);
            if (snowballToObstacle < obstacle.radius + game.snowballRadius) {
                this.active = false;
                Sound.play('impact', 0.5);
            }
        }
    }
    limitDistance(game) {
        // for (let e = 0; e < game.players.length; e++)
        for (let pName in game.players) {
            const p = game.players[pName];
            let distance = Vector.distanceBetween(p.position, this.position);
            if (distance > 5000) {
                this.active = false;
                // console.log("snowball removed");
            }
        }
    }
}
//# sourceMappingURL=snowball.js.map
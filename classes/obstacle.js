export class Obstacle {
    constructor(position, radius, color, picIndex) {
        this.color = "";
        this.picIndex = 0;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.picIndex = picIndex;
    }
    draw(game) {
        var _a, _b, _c, _d;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.save();
        (_b = game.ctx) === null || _b === void 0 ? void 0 : _b.translate(this.position.x, this.position.y);
        let r = this.radius * 1.4;
        (_c = game.ctx) === null || _c === void 0 ? void 0 : _c.drawImage(game.obstaclePics[this.picIndex], -r, -r, r * 2, r * 2);
        (_d = game.ctx) === null || _d === void 0 ? void 0 : _d.restore();
    }
}
//# sourceMappingURL=obstacle.js.map
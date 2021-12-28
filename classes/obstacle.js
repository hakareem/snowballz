import { ctx } from '../script.js';
export class Obstacle {
    constructor(position, radius, color, img) {
        this.color = "";
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.img = img;
    }
    draw() {
        ctx === null || ctx === void 0 ? void 0 : ctx.save();
        ctx === null || ctx === void 0 ? void 0 : ctx.translate(this.position.x, this.position.y);
        // ctx?.beginPath();
        // ctx?.arc(0, 0, this.radius, 0, Math.PI * 2);
        // ctx!.fillStyle = this.color;
        // ctx?.fill();
        // ctx?.stroke();
        // ctx?.closePath;
        let r = this.radius * 1.4;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(this.img, -r, -r, r * 2, r * 2);
        ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    }
}
//# sourceMappingURL=obstacle.js.map
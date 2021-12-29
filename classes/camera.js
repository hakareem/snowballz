import { Vector } from './vector.js';
export class Camera {
    static update(v, game) {
        var _a;
        Camera.focus = v;
        (_a = game.ctx) === null || _a === void 0 ? void 0 : _a.translate(-v.x + game.canvas.width / 2, -v.y + game.canvas.height / 2);
    }
}
Camera.focus = new Vector(0, 0);
//# sourceMappingURL=camera.js.map
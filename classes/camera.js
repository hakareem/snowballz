import { Vector } from './vector.js';
import { ctx, canvas } from '../script.js';
export class Camera {
    static update(v) {
        Camera.focus = v;
        ctx === null || ctx === void 0 ? void 0 : ctx.translate(-v.x + canvas.width / 2, -v.y + canvas.height / 2);
    }
}
Camera.focus = new Vector(0, 0);
//# sourceMappingURL=camera.js.map
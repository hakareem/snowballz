import { Vector } from './vector.js'
import { Game } from './game.js'

export class Camera {
  static focus: Vector = new Vector(0, 0);

  static update(v: Vector, game: Game) {
    Camera.focus = v;
    game.ctx?.translate(-v.x + game.canvas.width / 2, -v.y + game.canvas.height / 2);
  }
}

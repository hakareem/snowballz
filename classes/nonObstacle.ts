import { Vector } from './vector.js'
import { Game } from './game.js'


export class nonObstacle {
  position: Vector;
  radius: number;
  color: string = "";
  picIndex: number = 0;

  constructor(
    position: Vector,
    radius: number,
    color: string,
    picIndex: number,
  ) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.picIndex = picIndex
  }

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    let r = this.radius * 1.4;
    game.ctx?.drawImage(game.nonObstaclePics[this.picIndex], -r, -r, r * 2, r * 2);
    game.ctx?.restore();
  }
}
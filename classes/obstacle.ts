import { Vector } from "./vector.js";
import { Game } from "./game.js";

export class Obstacle {
  position: Vector;
  radius: number;
  color: string = "";
  picIndex: number = 0;
  collideable: boolean = false;
  layer: string;

  constructor(
    position: Vector,
    radius: number,
    color: string,
    picIndex: number,
    collideable: boolean,
    layer: string
  ) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.picIndex = picIndex;
    this.collideable = collideable;
    this.layer = layer;
  }

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    let r = this.radius * 1.4;
    game.ctx?.drawImage(
      game.obstaclePics[this.layer][this.picIndex],
      -r,
      -r,
      r * 2,
      r * 2
    );
    game.ctx?.restore();
  }
}

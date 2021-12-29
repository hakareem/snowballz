import { Vector } from './vector.js'
import { Game } from './game.js'


export class Obstacle {
  position: Vector;
  radius: number;
  color: string = "";
  img: HTMLImageElement;

  constructor(
    position: Vector,
    radius: number,
    color: string,
    img: HTMLImageElement
  ) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.img = img;
  }

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    let r = this.radius * 1.4;
    game.ctx?.drawImage(this.img, -r, -r, r * 2, r * 2);
    game.ctx?.restore();
  }
}
import { Vector } from './vector.js'
import { Game } from './game.js'

export class Footprints{
    position: Vector;

    constructor(position: Vector) {
        this.position = position;
    }

    draw(game:Game){
        game.ctx.save();
        game.ctx.translate(this.position.x, this.position.y);
        game.ctx.drawImage(image source, x position, y position, width, height);
        game.ctx.restore();
    }
}
import { Vector } from "./vector.js";
import { Game } from "./game.js";

export class Obstacle {
    
  constructor(public position: Vector,public radius: number,public color: string, public picIndex: number,public collideable: boolean, public layer: string, public drawScale:number  ) {
    //switched to public constructor properties (no need to initialise them all with this.that=theOther)
  }    
  

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    let r = this.radius * this.drawScale; //drawScale allows us to draw them bigger (or smaller) that their 'collidable' radius
    game.ctx?.drawImage(
      game.obstaclePics[this.layer][this.picIndex],
      -r,
      -r,
      r * 2,
      r * 2
    );

    //for debugging (Comment out - DON'T remore)
    if (this.collideable){
      game.ctx.beginPath()
      game.ctx.strokeStyle="blue"
      game.ctx.arc(0,0,this.radius,0,6.28)
      game.ctx.stroke()
    }

    game.ctx?.restore();
  }
}

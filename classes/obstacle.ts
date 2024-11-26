import { Vector } from "./vector.js";
import { Game } from "./game.js";
import { Spring } from "./spring.js";

export class Obstacle {

  public fallingInto:Obstacle|null = null
  public depth:number=0 //used for the falling flipping animation
  public enabled:boolean=true
  //public edges[]=[] //indices of the game.masses -allows two objects to be hinged at a shared mass ,
  
    
  constructor(public position: Vector,
            public angle:number,
            public radius: number,
            public color: string, public picIndex: number,public collideable: boolean, public layer: string, public drawScale:number, public mass:number
            
          ) {
    //switched to public constructor properties (no need to initialise them all with this.that=theOther)
  }    
  
  
  moveTowards(t:Vector, speed:number){
    let v = t.subtract(this.position).normalise().multiply(speed)
    this.position = this.position.add(v)
  }

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    game.ctx?.rotate(this.angle);
    if (this.depth>0){
      const s=1-(this.depth/20)
      game.ctx?.scale(s, s* Math.sin(this.depth)) //tumble the coin
    }
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

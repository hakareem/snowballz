import { Vector } from "./vector.js";
import { Game } from "./game.js";
import { Spring } from "./spring.js";

export class Thing {
    //a thing is really a collection of springs (which never intersect)
    //to which we pin an image

  //public fallingInto:Obstacle|null = null
  //public depth:number=0 //used for the falling flipping animation
  public enabled:boolean=true
  //public edges[]=[] //indices of the game.masses -allows two objects to be hinged at a shared mass ,
  public springs:Spring[] =[]
  //public omi:number=-1
  //public ymi:number=-1
  //public omi:number=-1
  
    
  constructor(public layer:string,public picIndex: number) { //},public omi:number,public ymi:number,public xmi:number) {
    //switched to public constructor properties (no need to initialise them all with this.that=theOther)
  }    
      
  draw(game: Game) {
    
    if (this.springs.length>1){
      
      game.ctx?.save();
      const m= game.masses
      const o=m[this.springs[0].m2].p
      const x=m[this.springs[0].m1].p
      const y=m[this.springs[1].m2].p

      game.ctx?.translate(o.x,o.y);

      const xa= x.subtract(o)    
      const ya= y.subtract(o)
      
      const angle=Math.atan2(xa.y,xa.x)
      game.ctx?.rotate(angle);
        
    // let r = this.radius * this.drawScale; //drawScale allows us to draw them bigger (or smaller) that their 'collidable' radius
      game.ctx?.drawImage(game.obstaclePics[this.layer][this.picIndex],
        0,
        0,
        xa.length,
        -ya.length
      );
      game.ctx?.restore();
    }
  }
}

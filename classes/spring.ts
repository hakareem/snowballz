import {Game} from './game.js'
import { Vector } from './vector.js';

export class Spring{

    public length:number = 0
  
    constructor(game:Game, public m1:number, public m2:number,public collidable:boolean){    
      //set rest length at constrcution
      if (m1==m2) {alert('degenerate spring (both ends same mass) at construction ' + m1)}
      this.length = game.masses[m1].p.distanceFrom(game.masses[m2].p)
      if (this.length==0) {alert('zero length spring at construction')}
    }
    
    stretch(game:Game){
      const m1=game.masses[this.m1];
      const m2=game.masses[this.m2];
  
      let delta = m2.p.subtract(m1.p)       
      let distance = delta.length

      if (distance ==0){alert('zero length spring')}

      let difference = (this.length - distance) / distance
      let move = delta.multiply(difference * 0.5 * 0.2) //stiffness
      m1.p.subIn(move)  //unless they're pinned
      m2.p.addIn(move) 
    }


    contains(game:Game, p:Vector):Boolean{
      
      const v1=p.subtract(game.masses[this.m1].p) //vector from m1 to p
      const v2=p.subtract(game.masses[this.m2].p) //vector from m2 to p   
      
      return v1.dot(v2)<0 //if the dot product is negative, then the vectors (from the point to the endpoints) are pointing in opposite directions - and the point is within the spring
    }

    direction(game:Game):Vector{
      return game.masses[this.m2].p.subtract(game.masses[this.m1].p).normalise()
    }
     

    draw(game: Game) {

        const m1=game.masses[this.m1];
        const m2=game.masses[this.m2];
          
        //for debugging (Comment out - DON'T remore)
        
        game.ctx.moveTo(m1.p.x,m1.p.y)
        game.ctx.lineTo(m2.p.x,m2.p.y)
    
        game.ctx?.restore();
      }

  
  }
  
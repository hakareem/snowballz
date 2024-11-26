import { Vector } from './vector.js';
import { Game } from './game.js';
import { Thing } from './thing.js';
import { Spring } from './spring.js';


export class Mass{
    public op:Vector 
    public fallingInto:Thing|null = null    
    constructor (public p:Vector,public r:number){
        this.op = new Vector(p.x,p.y)
    }
    

    draw(game: Game) {
        //game.ctx?.save();
        //game.ctx?.translate(this.p.x, this.p.y);
        
        //for debugging (Comment out - DON'T remore)
        
        game.ctx.moveTo(this.p.x,this.p.y)
        game.ctx.arc(this.p.x,this.p.y,this.r,0,6.28)


    }

    penetrates(game:Game,thing:Thing):boolean{
        //pushes masses back out of objects
        
        let hitfirst=null
        let spen = 10
        for (let s=0;s<thing.springs.length;s++){
            const spring=thing.springs[s]
            if (spring.collidable){
                if (spring.contains(game,this.p)){ //are we within the endpoints of the spring              
                    const pen = this.sideof(game,spring)-this.r
                    if (pen >0 && pen <spen) { //we're on the wrong side                    
                        hitfirst=spring
                        spen=pen
                        
                    }
                }                
            }
        }

        if (hitfirst){
            //a mass can only penetrate one spring on a given thing at a time
            const ratio = 0.9 //how much into the mass vs the spring
            const resolve =hitfirst.direction(game).rotate(-Math.PI/2).multiply(spen)
            console.log('resolve penetration of',spen)
            this.p.addIn(resolve.multiply(ratio)) //push it out to the left (things are defined clockwise) - so left is outwards
            
            const a=game.masses[hitfirst.m1].p
            const b=game.masses[hitfirst.m2].p

            const pol=this.p.closestPointOnLine(a,b)            
        
            const share = pol.distanceFrom(a)/hitfirst.length
            if (share>1 || share<0) {alert('share out of range')}

            a.subIn(resolve.multiply((1-ratio) * (1-share)))
            b.subIn(resolve.multiply((1-ratio) * share))

            return true
            
        }

        return false
        

    }

    //write some tests for this

    sideof(game:Game,spring:Spring):number{
        //return the signed distance of this point from the spring 
        const a=game.masses[spring.m1].p
        const b=game.masses[spring.m2].p

        return this.p.distanceFromLine(a,b) * -Math.sign(b.subtract(a).cross(this.p.subtract(a)))
        
        //const b=game.masses[spring.m2].p
        //return spring.direction(game).rotate(Math.PI/2).dot(this.p.subtract(a))
        
        
    }
}
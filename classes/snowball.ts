import {Vector} from './vector.js'
import {Game} from './game.js'
import {distanceBetween, ctx, snowballRadius, myIndex} from '../script.js';


export class Snowball {
    color: string = "";
    size: number = 0;
    position: Vector;
    velocity: Vector;
    distance: number = 0;
    active: boolean = true;
  
    constructor(position: Vector, velocity: Vector) {
      this.position = position;
      this.velocity = velocity;
    }
  
    draw() {
      ctx?.save();
      ctx?.translate(this.position.x, this.position.y);
      ctx?.beginPath();
      ctx?.arc(0, 0, 8, 0, Math.PI * 2);
      ctx?.stroke();
      ctx!.fillStyle = "snow";
      ctx?.fill();
      ctx?.closePath;
      ctx?.restore();
    }
    move() {
      this.position = this.position.add(this.velocity);
    }
  checkAgainstPlayers() {
      for (let i = 0; i < Game.players.length; i++) {
        if(i != myIndex) {
        const p = Game.players[i];
        let playerToSnowball = distanceBetween(p.position, this.position)
        if (playerToSnowball < p.radius + snowballRadius) {
          this.active = false
          p.hp -= 10
        }
      }
    }
  }
    checkAgainstObstacles() {
      for (let i = 0; i < Game.obstacles.length; i++) {
        const obstacle = Game.obstacles[i]
        let snowballToObstacle = distanceBetween(obstacle.position, this.position)
        if ( snowballToObstacle < obstacle.radius + snowballRadius) {
          this.active = false
        }
      }
    }
  
  
  }
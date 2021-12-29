import {Vector} from './vector.js'
import {Game} from './game.js'
import {distanceBetween, ctx, snowballRadius, myIndex} from '../script.js';
import { Player } from './player.js';


export class Snowball {
    color: string = "";
    size: number = 0;
    position: Vector;
    velocity: Vector;
    distance: number = 0;
    active: boolean = true;
  static position: any;
  
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
      ctx!.fillStyle = "lightblue";
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
  
    // mouseDown hold will no longer put u in aimMode unless u drag 
    // username at the bottom
    //healthbar above head
  // snowballs removed at a certain distant
  //random img


     limitDistance(){
 for (let e = 0; e < Game.players.length; e++){
      const p = Game.players[e]
      let distance = distanceBetween(p.position, this.position)
      if(distance > 1500){
        this.active = false
        console.log("snowball removed"); 
      }
      }
    }
  
  }
 
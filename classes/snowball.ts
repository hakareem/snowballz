import { Vector } from './vector.js'
import { Game } from './game.js'
// import { game } from '../script.js';
import { Player } from './player.js';
import { Sound } from './sounds.js'


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

  draw(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    game.ctx?.beginPath();
    game.ctx?.arc(0, 0, 10, 0, Math.PI * 2);
    game.ctx?.stroke();
    game.ctx!.fillStyle = "lightblue";
    game.ctx?.fill();
    game.ctx?.closePath;
    game.ctx?.restore();
  }
  move() {
    this.position = this.position.add(this.velocity);
  }
  checkAgainstPlayers(game: Game, owner: Player) {
    // for (let i = 0; i < game.players.length; i++)
    for (let pName in game.players) {
      const p = game.players[pName];
      if (p != owner) {
        let playerToSnowball = Vector.distanceBetween(p.position, this.position)
        if (playerToSnowball < p.radius + game.snowballRadius) {
          this.active = false
          p.hp -= 10
          if (p.hp <= 0) {
            p.killer = owner
          }
          Sound.play('playerGasp', 0.5)
        }
      }
    }
  }
  checkAgainstObstacles(game: Game) {
    for (let i = 0; i < game.obstacles.length; i++) {
      const obstacle = game.obstacles[i]
      let snowballToObstacle = Vector.distanceBetween(obstacle.position, this.position)
      if (snowballToObstacle < obstacle.radius + game.snowballRadius) {
        this.active = false
        Sound.play('impact', 0.5)
      }
    }
  }

  limitDistance(game: Game) {
    // for (let e = 0; e < game.players.length; e++)
    for (let pName in game.players) {
      const p = game.players[pName]
      let distance = Vector.distanceBetween(p.position, this.position)
      if (distance > 5000) {
        this.active = false
        // console.log("snowball removed");
      }
    }
  }

}

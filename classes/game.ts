import { Player } from './player.js'
import { Obstacle } from './obstacle.js'
import { Camera } from './camera.js'
import { distanceBetween, ctx, canvas, mouseBtnDown } from '../script.js';


export class Game {
  static players: Player[] = [];
  static obstacles: Obstacle[] = [];
  static cycle() {
    ctx?.resetTransform();
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    Camera.update(Game.players[0].position);
    for (let i = 0; i < Game.players.length; i++) {
      const p = Game.players[i];
      p.draw();
      p.move();
      p.drawAndMoveSnowballs();
      p.drawHealth();
      p.checkSnowballs();
      p.drawUsername();
      p.movePlayerAroundObstacles();
      while (p.pushOtherPlayersAway()) {}
      p.ghostMode()
      if (distanceBetween(p.position, p.destination) < 50 && mouseBtnDown == true) {
        p.drawAimLine();
        p.velocity.x = 0;
        p.velocity.y = 0;
      }
      else if (distanceBetween(p.position, p.destination) < 20) {
        p.velocity.x = 0;
        p.velocity.y = 0;
      }
    }
    Game.drawObstacles();
    requestAnimationFrame(Game.cycle);
  }
  static drawObstacles() {
    for (let i = 0; i < Game.obstacles.length; i++) {
      Game.obstacles[i].draw();
    }
  }
}
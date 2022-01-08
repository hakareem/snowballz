import { Vector } from "./vector.js";
import { Snowball } from "./snowball.js";
import { Game } from "./game.js";
import { Camera } from "./camera.js";

export class Player {
  username: string = "";
  position: Vector = new Vector(50, 50);
  velocity: Vector = new Vector(0, 0); // the direction the player is currently moving in
  destination: Vector = new Vector(0, 0);
  direction: Vector = new Vector(0, 0); // the last direction this player was known to be running in
  snowballs: Snowball[] = [];
  angle: number = 0; // rotation angle of the player(for drawing)
  target: Vector = new Vector(0, 0); // populate that during mouse movement
  hp: number = 0;
  hpMax: number = 0;
  img: HTMLImageElement;
  radius: number;
  killer: Player | null = null;
  stamina: number = 0;

  constructor(
    username: string,
    position: Vector,
    hp: number,
    hpMax: number,
    img: HTMLImageElement,
    radius: number,
    stamina: number
  ) {
    this.username = username;
    this.position = position;
    this.destination = this.position;
    this.hp = hp;
    this.hpMax = hpMax;
    this.img = img;
    this.radius = radius;
    this.stamina = stamina;
  }
  drawHealth(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    game.ctx?.scale(1, -1);

    game.ctx!.fillStyle = "red";
    let width = (60 * this.hp) / this.hpMax;
    if (width < 0) {
      width = 0;
    }
    game.ctx?.fillRect(-30, 30, width, 10);
    game.ctx!.strokeStyle = "black";
    game.ctx?.strokeRect(-30, 30, 60, 10);
    game.ctx?.restore();
  }

  drawStamina(game: Game) {
    game.ctx?.save();
    game.ctx?.translate(this.position.x, this.position.y);
    game.ctx?.scale(1, -2.2);
    game.ctx!.fillStyle = "green";
    let width = (60 * this.stamina) / 100;
    if (width < 0) {
      width = 0;
    }
    game.ctx?.fillRect(-30, 20, width, 5);
    game.ctx!.strokeStyle = "black";
    game.ctx?.strokeRect(-30, 20, 60, 5);
    game.ctx?.restore();
  }

  drawUsername(game: Game) {
    game.ctx!.textAlign = "center";
    game.ctx!.font = "25px Arial";
    game.ctx!.fillStyle = "black";
    game.ctx?.fillText(
      this.username,
      this.position.x + 5,
      this.position.y + 50
    );
  }
  draw(game: Game) {
    game.ctx?.save();
    let r = this.radius; //*1.4
    //game.pctx is s second canvas/context we use to pre-rotate the player
    game.pctx?.save();
    game.pctx?.clearRect(0, 0, r * 2, r * 2);
    game.pctx?.translate(r, r);
    game.pctx?.rotate(this.angle);
    game.pctx?.translate(-r, -r);
    game.pctx?.drawImage(this.img, r * 0.2, r * 0.2, r * 1.8, r * 1.8);
    game.pctx?.restore();
    game.ctx!.translate(this.position.x, this.position.y);
    game.ctx?.drawImage(game.pCanvas, -r, -r, r * 2, r * 2);
    
    //Debugging - comment out (don't remove)
    game.ctx.beginPath()
    game.ctx.strokeStyle="blue"
    game.ctx.arc(0,0,this.radius,0,6.28)
    game.ctx.stroke()

    game.ctx?.restore();

    
  }
  move() {
    this.position = this.position.add(this.velocity.multiply(this.stamina / 70 + 0.1) );
    
    this.stamina -= this.velocity.length / 26  // burn stamina
    this.stamina += 0.15 // regen stamina
    
    if(this.stamina <= 0 ){
      this.stamina = 0
    }else if(this.stamina > 100){
      this.stamina = 100
    }
  }

  drawSnowballs(game: Game) {
    for (let i = 0; i < this.snowballs.length; i++) {
      if (this.snowballs[i].active) {
        this.snowballs[i].draw(game);
      }
    }
  }
  highlight = new Array(
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255),
    Math.round(Math.random() * 255)
  );

  moveSnowballs() {
    for (let i = 0; i < this.snowballs.length; i++) {
      if (this.snowballs[i].active) {
        this.snowballs[i].move();
      }
    }
  }
  drawAimLine(game: Game) {
    for (let i = 5; i >= 0; i--) {
      game.ctx?.beginPath();
      game.ctx.lineWidth = (i + 1) * 2 - 2;
      game.ctx.moveTo(this.target.x, this.target.y);
      game.ctx?.lineTo(this.position.x, this.position.y);
      game.ctx.strokeStyle = "#000000";
      game.ctx.strokeStyle =
        "rgba(" +
        this.highlight[0] +
        "," +
        this.highlight[1] +
        "," +
        this.highlight[2] +
        ",0.5)";
      game.ctx.stroke();
    }
  }
  runToPoint(destination: Vector) {
    let p = this;
    p.destination = destination;
    // Do nothing if we are already at the point, otherwise we would get an division by 0 error
    if (Vector.distanceBetween(p.position, p.destination) < 0.01) {
      return;
    }
    let adjacent = p.destination.x - p.position.x;
    let opposite = p.destination.y - p.position.y;
    p.angle = -Math.atan2(-opposite, adjacent) - Math.PI / 2;
    let hypotenuse = Vector.hypo(adjacent, opposite);
    p.velocity.x = (adjacent / hypotenuse) * 5;
    p.velocity.y = (opposite / hypotenuse) * 5;
    p.direction = new Vector(p.velocity.x, p.velocity.y);
  }

  // shootSnowball(target: Vector, game: Game) {
  //   const p = game.players[0];
  //   const mouseCoord: Vector = new Vector(target.x, target.y);
  //   if (Vector.distanceBetween(mouseCoord, p.position) <= 20) {
  //     p.snowballs.push(new Snowball(p.position, p.direction));
  //   }
  // }
  pushOtherPlayersAway(game: Game) {
    let isOverlap = false;
    // for (let i = 0; i < game.players.length; i++)
    for (let pName in game.players) {
      const otherPlayer = game.players[pName];
      if (otherPlayer != this) {
        let dbt = Vector.distanceBetween(this.position, otherPlayer.position);
        if (dbt < 0.01) {
          otherPlayer.position.x += 2;
        }
        let overlap = (this.radius + otherPlayer.radius) - dbt;
        if (overlap > 0) {
          isOverlap = true;
          let vectorBetween = this.position.subtract(otherPlayer.position);
          let directionBetween = vectorBetween.normalise();
          otherPlayer.position = otherPlayer.position.subtract(
            directionBetween.multiply(overlap + 1)
          );
        }
      }
    }
    return isOverlap;
  }
  movePlayerAroundObstacles(game: Game) {
    for (let i = 0; i < game.obstacles.length; i++) {
      const obstacle = game.obstacles[i];
      if (obstacle.collideable) {
        let dbt = Vector.distanceBetween(this.position, obstacle.position);
        let overlap =  (obstacle.radius+this.radius)-dbt
        if (overlap > 0) {
          let vectorBetween = this.position.subtract(obstacle.position);
          let directionBetween = vectorBetween.normalise();
          this.position = this.position.add(directionBetween.multiply(overlap));
          this.velocity = new Vector(0,0)

          this.runToPoint(this.destination);
        }
      }
    }
  }

  fencePlayer(game:Game){
    if (this.position.x<0){this.position.x=0}
    if (this.position.y<0){this.position.y=0}
    if (this.position.x>game.fieldWidth){this.position.x=game.fieldWidth}
    if (this.position.y>game.fieldHeight){this.position.y=game.fieldHeight}
   
  }
  checkSnowballs(game: Game) {
    for (let s = 0; s < this.snowballs.length; s++) {
      let snowball = this.snowballs[s];
      if (snowball.active == true) {
        snowball.checkAgainstPlayers(game, this);
        snowball.checkAgainstObstacles(game);
        if (
          Vector.distanceBetween(snowball.position, this.position) >
          snowball.velocity.length * 100
        ) {
          snowball.active = false;
          console.log("removed");
        }
      }
    }
  }
}

import { Player } from './player.js'
import { Obstacle } from './obstacle.js'
import { Camera } from './camera.js'
import { Vector } from './vector.js'
import { Snowball } from './snowball.js'
import { fetchObject, endpoint } from './client.js'


export class Game {
  id: number = 0;
  players: Record<string, Player> = {}
  obstacles: Obstacle[] = [];
  numPlayers: number;
  playerRadius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pCanvas: HTMLCanvasElement
  pctx: CanvasRenderingContext2D
  mouseBtnDown: boolean = false;
  isAiming: boolean = false;
  snowballRadius: number;
  myName: string;
  private playerPics: string[] = [];
  obstaclePics: HTMLImageElement[] = [];

  constructor(numPlayers: number, playerRadius: number, snowballRadius: number, numObstacles: number, width: number, height: number, myName: string) {
    this.numPlayers = numPlayers
    this.playerRadius = playerRadius
    this.snowballRadius = snowballRadius
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")!
    document.body.appendChild(this.canvas)
    this.canvas.width = width;
    this.canvas.height = height;
    this.pCanvas = document.createElement("canvas")
    this.pCanvas.width = playerRadius * 2
    this.pCanvas.height = playerRadius * 2
    this.pctx = this.pCanvas.getContext("2d")!;
    this.myName = myName
    // this.setupPlayers(this.numPlayers, this.playerRadius)
    this.setupObstaclePics(numObstacles)
    this.setupPlayerPics()
    this.canvas.addEventListener("mousedown", (e) => this.mouseDown(e));
    this.canvas.addEventListener("mouseup", (e) => this.mouseUp(e));
    this.canvas.addEventListener("mousemove", (e) => this.mouseMovement(e));
    requestAnimationFrame(() => this.cycle());
  }
  cycle() {
    this.ctx?.resetTransform();
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.anyPlayers()) {
      Camera.update(this.players[this.myName].position, this);
    }
    // for (let i = 0; i < this.players.length; i++) 
    for (let pName in this.players) {
      const p = this.players[pName];
      p.draw(this);
      p.move();
      p.drawAndMoveSnowballs(this);
      p.drawHealth(this);
      p.checkSnowballs(this);
      p.drawUsername(this);

      if (p.hp > 0) {
        while (p.pushOtherPlayersAway(this)) { }
        p.movePlayerAroundObstacles(this);
      }
      else if (p.hp <= 0) {
        p.ghostMode()
      }
      if (Vector.distanceBetween(p.position, p.destination) < 50 && this.mouseBtnDown == true) {
        p.drawAimLine(this);
        p.velocity.x = 0;
        p.velocity.y = 0;
      }
      else if (Vector.distanceBetween(p.position, p.destination) < 20) {
        p.velocity.x = 0;
        p.velocity.y = 0;
      }
    }
    this.drawObstacles();
    requestAnimationFrame(() => this.cycle());
  }
  drawObstacles() {
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].draw(this);
    }
  }
  setupPlayerPics() {
    this.playerPics.push("player images/PLAYER1.png")
    this.playerPics.push("player images/PLAYER2.png")
    this.playerPics.push("player images/PLAYER3.png")
    this.playerPics.push("player images/PLAYER4.png")
    this.playerPics.push("player images/PLAYER5.png")
    this.playerPics.push("player images/PLAYER6.png")
    this.playerPics.push("player images/PLAYER8.png")
    this.playerPics.push("player images/PLAYER9.png")
    this.playerPics.push("player images/PLAYER10.png")
    this.playerPics.push("player images/PLAYER11.png")
    this.playerPics.push("player images/PLAYER12.png")
    this.playerPics.push("player images/PLAYER13.png")
    this.playerPics.push("player images/PLAYER14.png")
  }
  setupPlayers(numPlayers: number, playerRadius: number) {

    for (let i = 0; i < numPlayers; i++) {
      let img = document.createElement("img")
      let randomPic = Math.floor(Math.random() * this.playerPics.length)
      img.src = this.playerPics[randomPic]
      let pName = "player " + i

      this.players[pName] = (new Player(pName, new Vector(Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)), 100, 100, img, playerRadius));
    }
  }
  setupObstaclePics(numObstacles: number) {

    this.obstaclePics.push(this.img("obstacle images/TREES.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES1.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES2.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES3.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES4.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES6.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES7.png"));
    this.obstaclePics.push(this.img("obstacle images/TREES8.png"));

    for (let i = 0; i < numObstacles; i++) {
      let p = new Vector(Math.floor(Math.random() * 5000), Math.floor(Math.random() * 5000));
      let picIndex = Math.floor(Math.random() * this.obstaclePics.length)
      let o = new Obstacle(p, 50 + Math.random() * 50, "lightblue", picIndex);
      this.obstacles.push(o);
    }
  }
  async mouseDown(_e: MouseEvent) {
    if (this.anyPlayers()) {
      const p = this.players[this.myName];
      // startBackgroundMusic();
      if (Vector.distanceBetween(p.position, p.target) < 40) {
        this.isAiming = true;
        this.mouseBtnDown = true;
      }
      else {
        // p.runToPoint(p.target);
        let payload = { cmd: "runToPoint", playerName: this.myName, gameId: this.id, params: { position: p.target } }
        let msgs = await fetchObject(endpoint, payload)

        this.processMsgs(msgs) //just to display them

      }
    }
  }

  async mouseUp(_e: MouseEvent) {
    if (this.anyPlayers()) {
      const p = this.players[this.myName];
      if (this.isAiming) {
        let v: Vector = p.target.subtract(p.position).normalise().multiply(5)
        let payload = { cmd: "shootSnowball", playerName: this.myName, gameId: this.id, params: { position: p.position, velocity: v } }
        let msgs = await fetchObject(endpoint, payload)

        this.processMsgs(msgs) //just to display them
        // p.snowballs.push(new Snowball(p.position,p.target.subtract(p.position).normalise().multiply(5)));

        // startThrowSound();
      }
      this.mouseBtnDown = false;
      this.isAiming = false;
    }
  }

  mouseMovement(e: MouseEvent) {
    if (this.anyPlayers()) {
      let p = this.players[this.myName];
      p.target = new Vector(e.clientX + Camera.focus.x - this.canvas.width / 2, e.clientY + Camera.focus.y - this.canvas.height / 2);
    }
  }


  addPlayer(playerName: string, p: Vector) {
    let position = new Vector(p.x, p.y)  // p is not a true vector at this point and we need to reinstance a true vector from x and y values


    let img = document.createElement("img")
    img.src = this.playerPics[Object.keys(this.players).length % this.playerPics.length]
    this.players[playerName] = new Player(playerName, position, 100, 100, img, this.playerRadius)
  }


  async createAndJoinServerGame(playerName: string) {
    this.myName = playerName
    let cmd = { cmd: "createGame", playerName: this.myName, params: { trees: this.obstacles } }
    let gameInfo = await fetchObject(endpoint, cmd)
    this.id = gameInfo.gameId;  //we now know which game WE have joined (the creator)
    await this.joinServerGame(this.id, playerName)
    // return this.id
    // joinGame(this.id)
  }

  async joinServerGame(gameId: number, playerName: string) {
    let position: Vector = new Vector(Math.random() * 100, Math.random() * 100)
    this.myName = playerName
    this.id = gameId
    let payload = { cmd: "joinGame", playerName: playerName, gameId: gameId, params: { position: position } } //will return (assign to you)a player ID -
    let msgs = await fetchObject(endpoint, payload)

    this.processMsgs(msgs) //just to display them

    // if (msgs[0].gameId==-1){
    //     alert("No such game")
    // }
    // else{        
    //     gameId=msgs[0].gameId        
    //     console.log("Joined game")

    setInterval(() => this.poll(), 250) //start polling for incomming data
    // }
  }


  processMsgs(msgs: any[]) {
    if (msgs != undefined) {
      let rxd = document.getElementById("rxd")
      for (let i = 0; i < msgs.length; i++) {
        console.log(msgs[i].cmd)  //You will want to actually *do things* here .. like run players to points, and launch snowballs
        let m = msgs[i]
        if (m.cmd == "playerJoined") {
          this.addPlayer(m.playerName, m.params.position)
        }
        else if (m.cmd == "runToPoint") {
          let player = this.players[m.playerName]
          player.runToPoint(Vector.trueVector(m.params.position))
        }

        else if (m.cmd == "gameData") {
          this.obstacles = [] // remove our random trees [they are about to be replaced]
          for (let i = 0; i < m.params.trees.length; i++) {
            let o = m.params.trees[i]
            this.obstacles.push(new Obstacle(Vector.trueVector(o.position), o.radius, o.color, o.picIndex))
          }
          // this.obstacles = m.params.trees
        }
        else if (m.cmd == "shootSnowball") {
          let player = this.players[m.playerName]
          // player.shootSnowball(Vector.trueVector(m.params.target), this)
          player.snowballs.push(new Snowball(Vector.trueVector(m.params.position), Vector.trueVector(m.params.velocity)))
          //  p.snowballs.push(new Snowball(p.position,p.target.subtract(p.position).normalise().multiply(5)));
        }
      }
    }
  }
  async poll() {
    console.log("polling ");

    //periodically called, to fetch pending messages from the server
    let cmd = { cmd: "poll", playerName: this.myName, gameId: this.id } //will return (assign to you)a player ID -
    let msgs = await fetchObject(endpoint, cmd) //result is an object containing an array of messages
    this.processMsgs(msgs)
  }


  anyPlayers(): boolean {
    return (Object.keys(this.players).length > 0)
  }

  img(fileName: string): HTMLImageElement {
    let img = document.createElement("img")
    img.src = fileName
    return img
  }
}
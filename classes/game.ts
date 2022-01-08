import { Player } from "./player.js";
import { Obstacle } from "./obstacle.js";
import { Camera } from "./camera.js";
import { Vector } from "./vector.js";
import { Snowball } from "./snowball.js";
import { fetchObject, endpoint } from "./client.js";
import { Sound } from "./sounds.js";

export class Game {
  id: number = 0;
  players: Record<string, Player> = {};
  obstacles: Obstacle[] = [];
  numPlayers: number;
  playerRadius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pCanvas: HTMLCanvasElement;
  pctx: CanvasRenderingContext2D;
  mouseBtnDown: boolean = false;
  isAiming: boolean = false;
  snowballRadius: number;
  myName: string;
  private playerPics: string[] = [];
  obstaclePics: Record<string, HTMLImageElement[]> = {};

  constructor(
    numPlayers: number,
    playerRadius: number,
    snowballRadius: number,
    numObstacles: number,
    canvasWidth: number,
    canvasHeight: number,
    myName: string,
    public fieldWidth:number,
    public fieldHeight:number
  ) {
    this.numPlayers = numPlayers;
    this.playerRadius = playerRadius;
    this.snowballRadius = snowballRadius;
    this.canvas = document.createElement("canvas");

    //this.canvas.setAttribute("draggable","false") //Required to make mobile work (otherwise 'draggging' your guy, attempts to move the canvas instead of throwing a snowball)
    //this.canvas.style.touchAction="none"

    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.pCanvas = document.createElement("canvas");
    this.pCanvas.width = playerRadius * 2;
    this.pCanvas.height = playerRadius * 2;
    this.pctx = this.pCanvas.getContext("2d")!;
    this.myName = myName;
    // this.setupPlayers(this.numPlayers, this.playerRadius)
    this.setupObstaclePics(numObstacles);
    this.setupPlayerPics();
    this.canvas.addEventListener("mousedown", (e) =>
      this.mouseDown(e.clientX, e.clientY)
    );
    this.canvas.addEventListener("touchstart", (e) =>
      this.mouseDown(e.touches[0].clientX, e.touches[0].clientY)
    );
    this.canvas.addEventListener("mouseup", (e) => this.mouseUp());
    this.canvas.addEventListener("touchend", (e) => this.mouseUp()); //we hook the touch events to the same listeners to provide touch support

    this.canvas.addEventListener("mousemove", (e) =>
      this.mouseMovement(e.clientX, e.clientY)
    );
    this.canvas.addEventListener("touchmove", (e) =>
      this.mouseMovement(e.touches[0].clientX, e.touches[0].clientY)
    ); //mouse move events do not fire when 'dragging' with touch so we have to implement touch support (it seems)

    Sound.setup(["impact", "playerGasp", "throw"]);
    requestAnimationFrame(() => this.cycle());
    setInterval(() => {
      this.moveAll();
    }, (1 / 120) * 1000); //do our movement at 60fps (regardless of the device frame-rate)
  }
  moveAll() {
    //for more consistent gameplay accross deveices that might be running at very different frame rates,
    //we move players and snowballs on a setInterval - rather than in RequestAnimationFrame
    for (let pName in this.players) {
      const p = this.players[pName];
      p.move();
      p.moveSnowballs();
    }
  }
  cycle() {
  
    this.ctx?.resetTransform();
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.trackActivePlayer()    //The camera will track me, then my killer, then his killer etc.
    
    //Draw the layers in ORDER
    this.drawObstacles("snow");
    this.drawObstacles("puddles");
    this.drawObstacles("leaves");
    //Note trees are drawn after (over) players
    this.drawAndProcessPlayers()    
    this.drawObstacles("trees");

    requestAnimationFrame(() => this.cycle());
  }

  trackActivePlayer(){
    if (this.anyPlayers()) {
      let me = this.players[this.myName];
      let follow:Player=me
      while (follow.killer){follow=follow.killer}  //recurse down the 'chain' of killers
      Camera.update(follow.position, this);      
    }    
  }

  drawAndProcessPlayers(){
    let alive = 0;
    let lastStanding:string = ""
    
    for (let pName in this.players) {
      const p = this.players[pName];
      if(p.hp > 0){
        alive++
        lastStanding = pName
      }
      p.draw(this);
      //p.move();
      p.drawSnowballs(this);
      p.drawHealth(this);
      p.drawStamina(this);
      p.checkSnowballs(this);
      p.drawUsername(this);
      if (p.hp > 0) {
        //Is the player still alive?
        p.pushOtherPlayersAway(this) 
        p.movePlayerAroundObstacles(this);
        p.fencePlayer(this) 

      } else if (p.hp <= 0) {
        p.runToPoint(new Vector(0, 0)); // If this player is dead, it will run home (position 0,0)
      }
      if (
        Vector.distanceBetween(p.position, p.destination) < 50 &&
        this.mouseBtnDown == true
      ) {
        p.velocity.x = 0;
        p.velocity.y = 0;
        p.angle = -Math.atan2(
          p.position.x - p.target.x,
          p.position.y - p.target.y
        );
        p.drawAimLine(this);
      } else if (Vector.distanceBetween(p.position, p.destination) < 20) {
        p.velocity.x = 0;
        p.velocity.y = 0;
      }
    }
    if(alive == 1 && Object.keys(this.players).length > 1){
      alert(lastStanding + " wins")
    }
  }


  drawObstacles(layer: string) {
    for (let i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].layer == layer) {
        this.obstacles[i].draw(this);
      }
    }
  }
  setupPlayerPics() {
    this.playerPics.push("player images/PLAYER20.png");
    this.playerPics.push("player images/PLAYER22.png");
    this.playerPics.push("player images/PLAYER23.png");
    this.playerPics.push("player images/PLAYER24.png");
    this.playerPics.push("player images/PLAYER1.png");
    this.playerPics.push("player images/PLAYER2.png");
    this.playerPics.push("player images/PLAYER3.png");
    this.playerPics.push("player images/PLAYER4.png");
    this.playerPics.push("player images/PLAYER5.png");
    this.playerPics.push("player images/PLAYER6.png");
    this.playerPics.push("player images/PLAYER8.png");
    this.playerPics.push("player images/PLAYER9.png");
    this.playerPics.push("player images/PLAYER10.png");
    this.playerPics.push("player images/PLAYER11.png");
    this.playerPics.push("player images/PLAYER12.png");
    this.playerPics.push("player images/PLAYER13.png");
    this.playerPics.push("player images/PLAYER14.png");
    this.playerPics.push("player images/PLAYER15.png");
    this.playerPics.push("player images/PLAYER16.png");
    this.playerPics.push("player images/PLAYER18.png");
    this.playerPics.push("player images/PLAYER19.png");
    this.playerPics.push("player images/PLAYER25.png");
    this.playerPics.push("player images/PLAYER26.png");
    this.playerPics.push("player images/PLAYER27.png");
    this.playerPics.push("player images/PLAYER29.png");
  }
  setupPlayers(numPlayers: number, playerRadius: number) {
    for (let i = 0; i < numPlayers; i++) {
      let img = document.createElement("img");
      let randomPic = Math.floor(Math.random() * this.playerPics.length);
      img.src = this.playerPics[randomPic];
      let pName = "player " + i;

      this.players[pName] = new Player(
        pName,
        new Vector(
          Math.floor(Math.random() * 400),
          Math.floor(Math.random() * 400)
        ),
        100,
        100,
        img,
        playerRadius,
        100
      );
    }
  }
  setupPics(layer:string, picList:string, extension: string){
    let pics = picList.split(",")
    this.obstaclePics[layer] = []
    for (let i of pics) {
    this.obstaclePics[layer].push(this.img(layer + "/" + i + extension));
    }
    return pics.length
  }

  setupTiledLayer(layer:string, picList:string, tileSize:number,  extension: string){
    this.setupPics(layer,picList,extension)
    let x = 0
    let y =0
    for (let i = 0; i< this.fieldWidth/tileSize; i++){
      for(let j = 0; j < this.fieldHeight/tileSize; j++){
      let o = new Obstacle(new Vector(x,y),tileSize / 2,"lightblue",0,false,layer,1);
      this.obstacles.push(o);
      x += tileSize
      }
      x = 0
      y += tileSize 
    }
  }
  setupRandomLayer(layer: string, picList: string, extension: string, numObstacles: number, collideable: boolean, minRadius: number, maxRadius: number,drawScale:number){
    let numPics = this.setupPics(layer,picList,extension)
    for (let i = 0; i < numObstacles; i++) {
      let p = new Vector(
        Math.floor(Math.random() * this.fieldWidth),
        Math.floor(Math.random() * this.fieldHeight)
      );
      let picIndex = Math.floor(
        Math.random() * numPics
      );
      let o = new Obstacle(p,minRadius + Math.random() * (maxRadius- minRadius),"lightblue",picIndex,collideable,layer,drawScale);
      this.obstacles.push(o);
    }
  }

  setupObstaclePics(numObstacles: number) {
    this.setupTiledLayer("snow", "snow", 512, ".jpg")
    //NB: Trees are drawn with a drawScale of 1.4 (ie.. substantially bigger than their 'collidable' circles)
    this.setupRandomLayer("trees","trees,trees1,trees2,trees3,trees4,trees5,trees6,trees7,trees8,trees9,trees10,trees11,trees12,trees13,trees14,trees15,trees16,trees17,trees18",".png", 50, true,150,25,1.4)
    this.setupRandomLayer("puddles", "puddle2",".png", 30, false,50,150,1)
    this.setupRandomLayer("leaves", "leaf",".png", 150, false,10,10,1)

  }

  async mouseDown(x: number, y: number) {
    console.log("md");

    this.mouseMovement(x, y);

    if (this.anyPlayers()) {
      const p = this.players[this.myName];
      if (Vector.distanceBetween(p.position, p.target) < 40) {
        this.isAiming = true;
        this.mouseBtnDown = true;
      } else {
        // p.runToPoint(p.target);
        let payload = {
          cmd: "runToPoint",
          playerName: this.myName,
          gameId: this.id,
          params: {
            destination: p.target,
            position: p.position,
            health: p.hp,
            stamina: p.stamina,
          },
        };
        let msgs = await fetchObject(endpoint, payload);

        this.processMsgs(msgs); //just to display them
      }
    }
  }

  async mouseUp() {
    console.log("mu");
    if (this.anyPlayers()) {
      const p = this.players[this.myName];

      if (this.isAiming) {
        // let v: Vector = p.target.subtract(p.position).normalise().multiply(5)
        let v: Vector = p.target.subtract(p.position).multiply(0.02);

        let payload = {
          cmd: "shootSnowball",
          playerName: this.myName,
          gameId: this.id,
          params: { position: p.position, velocity: v },
        };
        let msgs = await fetchObject(endpoint, payload);

        this.processMsgs(msgs); //just to display them
        // p.snowballs.push(new Snowball(p.position,p.target.subtract(p.position).normalise().multiply(5)));

        // startThrowSound();
      }
      this.mouseBtnDown = false;
      this.isAiming = false;
    }
  }

  mouseMovement(x: number, y: number) {
    console.log("mm");
    if (this.anyPlayers()) {
      let p = this.players[this.myName];
      p.target = new Vector(
        x + Camera.focus.x - this.canvas.width / 2,
        y + Camera.focus.y - this.canvas.height / 2
      );
    }
  }
  addPlayer(playerName: string, p: Vector) {
    let position = new Vector(p.x, p.y); // p is not a true vector at this point and we need to reinstance a true vector from x and y values
    let img = document.createElement("img");
    img.src =
      this.playerPics[
        Object.keys(this.players).length % this.playerPics.length
      ];
    this.players[playerName] = new Player(
      playerName,
      position,
      100,
      100,
      img,
      this.playerRadius,
      100
    );
  }
  async createAndJoinServerGame(playerName: string) {
    this.myName = playerName;
    let cmd = {
      cmd: "createGame",
      playerName: this.myName,
      params: { trees: this.obstacles },
    };
    let gameInfo = await fetchObject(endpoint, cmd);
    this.id = gameInfo.gameId; //we now know which game WE have joined (the creator)
    await this.joinServerGame(this.id, playerName);
    // return this.id
    // joinGame(this.id)
  }
  async joinServerGame(gameId: number, playerName: string) {
    let position: Vector = new Vector(Math.random() * 100, Math.random() * 100);
    this.myName = playerName;
    this.id = gameId;
    let payload = {
      cmd: "joinGame",
      playerName: playerName,
      gameId: gameId,
      params: { position: position },
    }; //will return (assign to you)a player ID -
    let msgs = await fetchObject(endpoint, payload);

    this.processMsgs(msgs); //just to display them

    // if (msgs[0].gameId==-1){
    //     alert("No such game")
    // }
    // else{
    //     gameId=msgs[0].gameId
    //     console.log("Joined game")

    setInterval(() => this.poll(), 250); //start polling for incomming data
    // }
  }
  processMsgs(msgs: any[]) {
    if (msgs != undefined) {
      let rxd = document.getElementById("rxd");
      let check = msgs.length;
      for (let i = 0; i < msgs.length; i++) {
        // console.log(msgs[i].sqn)  //You will want to actually *do things* here .. like run players to points, and launch snowballs
        let m = msgs[i];
        if (m.cmd == "playerJoined") {
          this.addPlayer(m.playerName, m.params.position);
        } else if (m.cmd == "runToPoint") {
          let player = this.players[m.playerName];
          player.position = Vector.trueVector(m.params.position); // recieve definitive stats from the original player
          player.hp = m.params.health; // recieve definitive stats from the original player
          player.stamina = m.params.stamina; // recieve definitive stats from the original player
          player.runToPoint(Vector.trueVector(m.params.destination));
        } else if (m.cmd == "gameData") {
          this.obstacles = []; // remove our random trees [they are about to be replaced]
          for (let i = 0; i < m.params.trees.length; i++) {
            let o = m.params.trees[i];
            this.obstacles.push(
              new Obstacle(
                Vector.trueVector(o.position),
                o.radius,
                o.color,
                o.picIndex,
                o.collideable,
                o.layer,
                o.drawScale
              )
            );
          }
          // this.obstacles = m.params.trees
        } else if (m.cmd == "shootSnowball") {
          let player = this.players[m.playerName];
          player.snowballs.push(
            new Snowball(
              Vector.trueVector(m.params.position),
              Vector.negate(m.params.velocity)
            )
          );
          // player.shootSnowball(Vector.trueVector(m.params.target), this)
          Sound.play("throw", 0.01);
        }
      }
      if (msgs.length != check) {
        alert("its all wrong oh noo");
      }
    }
  }
  async poll() {
    // console.log("polling ");
    //periodically called, to fetch pending messages from the server
    let cmd = { cmd: "poll", playerName: this.myName, gameId: this.id }; //will return (assign to you)a player ID -
    let msgs = await fetchObject(endpoint, cmd); //result is an object containing an array of messages
    this.processMsgs(msgs);
  }
  anyPlayers(): boolean {
    return Object.keys(this.players).length > 0;
  }
  img(fileName: string): HTMLImageElement {
    console.log(fileName);
    let img = document.createElement("img");
    img.src = fileName;
    return img;
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

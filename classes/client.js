var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { game } from '../script.js';
import { Vector } from './vector.js';
let gameId = 0;
let playerName = "";
export const endpoint = "http://localhost:5050"; //change to the correct deployed port
// export async function createGame(){
//     playerName=(<HTMLInputElement>document.getElementById("playerName")).value
//     let cmd={cmd:"createGame",playerName:playerName}
//     let gameInfo= await fetchObject(endpoint,cmd)
//     // processMsgs(msgs)
//     gameId=gameInfo.gameId;  //we now know which game WE have joined (the creator)
//     (<HTMLInputElement>document.getElementById("gameToShare")).value=gameId.toString() 
//     joinGame(gameId)
// }
function joinGame(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        let position = new Vector(Math.random() * 2000, Math.random() * 2000);
        let payload = { cmd: "joinGame", playerName: playerName, gameId: gameId, params: { position: position } }; //will return (assign to you)a player ID -
        let msgs = yield fetchObject(endpoint, payload);
        processMsgs(msgs); //just to display them
        if (msgs[0].gameId == -1) {
            alert("No such game");
        }
        else {
            gameId = msgs[0].gameId;
            console.log("Joined game");
            setInterval(poll, 1000); //start polling for incomming data
        }
    });
}
function joinGameHTML() {
    return __awaiter(this, void 0, void 0, function* () {
        playerName = document.getElementById("playerName").value;
        let gameToJoin = parseInt(document.getElementById("gameToJoin").value);
        joinGame(gameToJoin);
        //let payload={gameId:"1",playerId:"1",sqn:"-1",action:{cmd:"runTo",position:{x:100,y:100}}}
        //let payload={cmd:"createGame",myName:"Nick"} //response will include the game Id (pin), and your playerId - you will automatically join the game            
        //let payload={cmd:"runTo",playerId:"1",sqn:"-1",action:{cmd:"runTo",position:{x:100,y:100}}}
        //let payload={cmd:"throw",playerId:"1",sqn:"-1",action:{cmd:"runTo",position:{x:100,y:100}}}
        //let payload={cmd:"poll",playerId:1}  // returns all queued items (for playerId) - which includes Joined players
        //gameId:string
        //playerId:string
        //sqn:number   //sequence number    
        //action:object //can be an empty object (if the player is just polling - no sqn will be generated)
    });
}
function runTo() {
    return __awaiter(this, void 0, void 0, function* () {
        //Example game command (telling the server we are running to a new point)
        //all commands must have a cmd, playerName,gameId and *optionally* a params *object* containing arbitrary parameters
        let cmd = { cmd: "runTo", playerName: playerName, gameId: gameId, params: { x: 100, y: 400 } }; //this will be 'echod' back to us (along with any other pending messages)
        let msgs = yield fetchObject(endpoint, cmd); //send our 'command' up - and receive all pending messages
        processMsgs(msgs); //Output/process the messages
    });
}
function poll() {
    return __awaiter(this, void 0, void 0, function* () {
        //periodically called, to fetch pending messages from the server
        let cmd = { cmd: "poll", playerName: playerName, gameId: gameId }; //will return (assign to you)a player ID -
        let msgs = yield fetchObject(endpoint, cmd); //result is an object containing an array of messages
        processMsgs(msgs);
    });
}
function processMsgs(msgs) {
    let rxd = document.getElementById("rxd");
    for (let i = 0; i < msgs.length; i++) {
        console.log(msgs[i].cmd); //You will want to actually *do things* here .. like run players to points, and launch snowballs
        // let msg:HTMLParagraphElement=document.createElement("p")
        // msg.innerText=msgs[i].cmd
        // rxd.appendChild(msg)
        let m = msgs[i];
        if (m.cmd == "playerJoined") {
            game.addPlayer(m.playerName, m.params.position);
        }
    }
}
export function fetchObject(url, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const method = "POST";
        const headers = { 'Accept': 'text/html', 'Content-Type': 'application/json' };
        const response = yield fetch(url, { method: method, body: JSON.stringify(payload), headers: headers });
        //const response = await fetch(url, {method:method,headers:{'Accept':'text/html','Content-Type':'application/json'}})
        if (response.ok) {
            return yield response.json();
        }
        else {
            console.log(`unexpected response status ${response.status} + ${response.statusText}`);
        }
    });
}
//# sourceMappingURL=client.js.map
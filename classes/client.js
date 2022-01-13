var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let gameId = 0;
let playerName = "";
export const endpoint = "http://snowballz.org:5050";
//change to the correct deployed port
// export async function createGame(){
//     playerName=(<HTMLInputElement>document.getElementById("playerName")).value
//     let cmd={cmd:"createGame",playerName:playerName}
//     let gameInfo= await fetchObject(endpoint,cmd)
//     // processMsgs(msgs)
//     gameId=gameInfo.gameId;  //we now know which game WE have joined (the creator)
//     (<HTMLInputElement>document.getElementById("gameToShare")).value=gameId.toString() 
//     joinGame(gameId)
// }
// async function joinGame(gameId: number){
//  let position: Vector = new Vector(Math.random()* 2000,Math.random()* 2000)
//  let payload={cmd:"joinGame",playerName:playerName,gameId:gameId,params:{position: position}} //will return (assign to you)a player ID -
//     let msgs=await fetchObject(endpoint,payload)
//     processMsgs(msgs) //just to display them
//     if (msgs[0].gameId==-1){
//         alert("No such game")
//     }
//     else{        
//         gameId=msgs[0].gameId        
//         console.log("Joined game")
//         setInterval(poll,1000) //start polling for incomming data
//     }        
// }
// async function runTo(){
//     //Example game command (telling the server we are running to a new point)
//     //all commands must have a cmd, playerName,gameId and *optionally* a params *object* containing arbitrary parameters
//     let cmd= {cmd:"runTo",playerName:playerName,gameId:gameId,params:{x:100,y:400}} //this will be 'echod' back to us (along with any other pending messages)
//     let msgs:any[] = await fetchObject(endpoint,cmd) //send our 'command' up - and receive all pending messages
//     processMsgs(msgs) //Output/process the messages
// }
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
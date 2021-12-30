// import { Game } from './game.js'
import { Vector } from './vector.js'


let gameId:number =0
let playerName:string=""
export const endpoint="http://localhost:5050"   //change to the correct deployed port

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




export async function fetchObject(url: string,payload:any){
    const method="POST"
    const headers={'Accept':'text/html','Content-Type':'application/json'}
    const response = await fetch(url, {method:method,body:JSON.stringify(payload),headers:headers})
    //const response = await fetch(url, {method:method,headers:{'Accept':'text/html','Content-Type':'application/json'}})
    if (response.ok){
        return await response.json()   
    }
    else{
        console.log(`unexpected response status ${response.status} + ${response.statusText}`)
    }
}

// "use strict";

// const canvas = document.querySelector("#myCanvas");
// // make sure that canvas covers the screen entirely
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const ctx = canvas.getContext("2d");
// // ctx.fillRect(50, 50, 100, 100);

// //keyboard keys object
// const keyboardState = {};
// let angle = 0;
// //this functions renders the player's character
// function renderAvatar(player) {
//   ctx.save();
//   ctx.translate(player.position.x, player.position.y);
//   //drawing the player
//   ctx.beginPath();
//   ctx.arc(0, 0, 20, 0, 2 * Math.PI);
//   ctx.closePath();
//   ctx.fillStyle = player.color;
//   ctx.fill();

//   //adding usernames
//   ctx.textAlign = "center";
//   ctx.fillStyle = "black";
//   ctx.fillText(player.username, 0, 30);

//   // drawing the eyes
//   // ctx.rotate(player.rotation);
//   // this switch statement is needed for eye direction change
//   // switch (player.rotation) {
//   //   case lookingDown:
//   //     ctx.rotate(0);
//   //     break;
//   //   case lookingUp:
//   //     ctx.rotate(Math.PI);
//   //     break;
//   //   case lookingRight:
//   //     ctx.rotate(Math.PI * 1.5);
//   //     break;
//   //   case lookingLeft:
//   //     ctx.rotate(Math.PI / 2);
//   //     break;
//   // }
//   ctx.rotate(angle);
//   // maybe figure out a way to make the eyes look like a circle instead of lines
//   //inner circle
//   ctx.beginPath();
//   ctx.moveTo(-5, 12);
//   ctx.lineTo(-9, 4);
//   ctx.moveTo(5, 12);
//   ctx.lineTo(9, 4);
//   ctx.stroke();

//   ctx.restore();
// }

// // this function renders the snowball
// function renderSnowball(snowball) {
//   ctx.save(); // the default settings are saved
//   ctx.translate(snowball.x, snowball.y);

//   //drawing the snowball
//   ctx.beginPath();
//   ctx.arc(0, 0, 8, 0, 2 * Math.PI);
//   ctx.closePath();
//   // hard coded because it'll be the same
//   ctx.fillStyle = "lightblue";
//   ctx.fill();

//   ctx.restore(); // restores any changes made
// }

// // variables to control directions and speed
// const snowballSpeed = 4;
// const playerSpeed = 3;
// const lookingUp = 0;
// const lookingDown = 1;
// const lookingRight = 2;
// const lookingLeft = 3;

// const gameState = {
//   players: [
//     {
//       username: prompt("enter your username"),
//       // username: "zack",
//       position: { x: 50, y: 50 },
//       velocity: { x: 0, y: 0 },
//       destination: { x: 0, y: 0 },
//       color: "#2eff08",
//       rotation: lookingDown, //default looking direction
//       snowballs: [],

//       // {
//       //   // only have values here to check how changes affect the snowball otherwise it'll be empty
//       //   x: 50,
//       //   y: 150,
//       //   vx: 0,
//       //   vy: snowballSpeed,
//       // },
//       // {
//       //   x: 100,
//       //   y: 300,
//       //   vx: snowballSpeed,
//       //   vy: 0,
//       // },
//       // ],
//     },
//     // {
//     //   username: "zack",
//     //   position: { x: 50, y: 50 },
//     //   velocity: { x: 0, y: 0 },
//     //   destination: { x: 0, y: 0 },
//     //   color: "orange",
//     //   rotation: lookingDown, //default looking direction
//     //   snowballs: [],
//     // },
//     // {
//     //   username: "123",
//     //   x: 600,
//     //   y: 300,
//     //   color: "purple",
//     //   rotation: lookingUp, //default looking direction
//     //   snowballs: [],
//     // },
//   ],
// };

// // this function draws the players and snowballs depending on the content of the game state
// function render(state) {
//   //background color
//   ctx.fillStyle = "black";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   //invoked the player f
//   state.players.forEach(function (player) {
//     renderAvatar(player);
//     //invoked the snowball f
//     player.snowballs.forEach(function (snowball) {
//       renderSnowball(snowball);
//     });
//   });
// }

// // this function will be modifying the game state
// function logic(state) {
//   state.players.forEach(function (player) {
//     player.snowballs.forEach(function (snowball) {
//       snowball.x += snowball.vx;
//       snowball.y += snowball.vy;
//       // get rid of snowball when either of these conditions is true
//       if (
//         snowball.x < 0 ||
//         snowball.x > window.innerWidth ||
//         snowball.y < 0 ||
//         snowball.y > window.innerHeight
//       ) {
//         snowball.remove = true;
//         console.log("checking if it's removing the snowballs?");
//       }
//     });
//     // need to filter so if condition isnt true anymore
//     player.snowballs = player.snowballs.filter(function (snowball) {
//       let remain = snowball.remove !== true;
//       return remain;
//     });
//   });
//   // all the movement options are implmented here
//   // s & d have to be positive for correct movement
//   // noticed that movement keys don't work when CAPs Lock is on????
//   const myPlayer = state.players[0];
//   if (keyboardState.w) {
//     myPlayer.position.y -= playerSpeed;
//     myPlayer.rotation = lookingUp;
//   }
//   if (keyboardState.s) {
//     myPlayer.position.y += playerSpeed;
//     myPlayer.rotation = lookingDown;
//   }
//   if (keyboardState.d) {
//     myPlayer.position.x += playerSpeed;
//     myPlayer.rotation = lookingRight;
//   }
//   if (keyboardState.a) {
//     myPlayer.position.x -= playerSpeed;
//     myPlayer.rotation = lookingLeft;
//   }
//   myPlayer.position.x += myPlayer.velocity.x;
//   myPlayer.position.y += myPlayer.velocity.y;

//   if (distanceBetween(myPlayer.position, myPlayer.destination) < 10) {
//     myPlayer.velocity.x = 0;
//     myPlayer.velocity.y = 0;
//   }
// }
// const myPlayer = gameState.players[0];
// // everything in invoked in this function
// function gameloop() {
//   requestAnimationFrame(gameloop);
//   logic(gameState);
//   render(gameState);
// }

// gameloop();

// function hypo(adjacent, opposite) {
//   return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
// }

// function distanceBetween(a, b) {
//   return hypo(b.x - a.x, b.y - a.y);
// }
// document.addEventListener("click", function (e) {
//   myPlayer.destination.x = e.x;
//   myPlayer.destination.y = e.y;

//   let adjacent = myPlayer.destination.x - gameState.players[0].position.x;
//   let opposite = myPlayer.destination.y - gameState.players[0].position.y;

//   angle = -Math.atan2(-opposite, adjacent) - Math.PI / 2;
//   let hypotenuse = hypo(adjacent, opposite);
//   myPlayer.velocity.x = (adjacent / hypotenuse) * 5;
//   myPlayer.velocity.y = (opposite / hypotenuse) * 5;

//   // ctx.rotate(angle);
// });

// document.addEventListener("keydown", function (e) {
//   // as long as condition is true it works
//   keyboardState[e.key] = true;
//   console.log("key:" + e.key);
//   // .spacebar doesn't exist  [" "] is the equiv i guess
//   // check key values on MDN for other inputs that can be used
//   if (keyboardState[" "]) {
//     //to make code easier to understand
//     const myPlayer = gameState.players[0];
//     const snowball = {
//       x: myPlayer.position.x,
//       y: myPlayer.position.y,
//       vx: 0,
//       vy: 0,
//     };
//     // this controls shooting the snowballs
//     switch (myPlayer.rotation) {
//       case lookingDown:
//         snowball.vy = snowballSpeed;
//         break;
//       case lookingUp:
//         snowball.vy = -snowballSpeed;
//         break;
//       case lookingRight:
//         snowball.vx = snowballSpeed;
//         break;
//       case lookingLeft:
//         snowball.vx = -snowballSpeed;
//         break;
//     }
//     // pushing the snowball to the game state object
//     myPlayer.snowballs.push(snowball);
//   }
// });
// document.addEventListener("keyup", function (e) {
//   // when u let go of the key press, the player stops
//   //e is the event handler, .key being the btn
//   keyboardState[e.key] = false;
// });

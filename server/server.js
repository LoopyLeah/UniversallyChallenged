//setting up server routing
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//session saving
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
//Server-side file handling
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile('/app/public/index.html');
});
server.listen(port)
console.log("Server running at:"+port);

//Game server-side code

//list of rooms, with the players
let rooms = {};

let clientRooms = {};

//let arrayOfPlayers = []

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  // join the "userID" room
  socket.join(socket.userID);

  //when a player enters a NEW room/game
  socket.on('new-game', function(name) {
    console.log("user id: " + socket.id);
    //make a random 6 digit room code
    let roomCode = Math.floor(Math.random() * 1000000);
    console.log("room code: " + roomCode);
    socket.join(roomCode);

    //create a new room object
    rooms[roomCode] = {
      roomCode: roomCode,
      players: [],
      gameStarted: false,
      gameOver: false,
    }

    //add the player object to the room
    rooms[roomCode].players.push({
      id: socket.id,
      name: name,
      score: 0,
      ready: false,
    });

    console.log("player " + name + " added to room: " + roomCode);
    console.log(rooms);
    console.log(rooms[roomCode].players);

    socket.emit('room-code', roomCode);
    sendPlayerNamesForLobby(roomCode);
    //not printing for first person aka host when he is in
    //the new room lobby whereas eevryone in the existing room lobby gets the updates
  });

  //when a player JOINS an EXISTING room/game
  socket.on('join-game', function(data) {
    //console log the room code
    console.log(data.code);
    console.log(data.name);
    //join the room
    socket.join(data.code);

    //add the player to the room
    rooms[data.code].players.push({
      id: socket.id,
      name: data.name,
      score: 0,
      ready: false,
      votes: 0,
      isOddOneOut: false,
    });

    console.log("player " + data.name + " added to room: " + data.code);
    console.log(rooms[data.code].players);

    socket.emit('room-code', data.code);
    sendPlayerNamesForLobby(data.code);
  })

  //when the game is started
  // socket.on('start-game', function(){
  //   console.log("starting game");
  //   io.emit('game-started');
  // })
  socket.on('start-game', function(data){
    console.log("starting game");
    io.emit('game-started');
    //emitGameState(roomCode, rooms[roomCode]);
    //emitNextStageToAll(data.code);
  })

  // socket.on('game-over', function(data){
  //   console.log("game over");
  //   io.emit('game-over');
  // })

  //when voting-start is called, emit the players in the lobby
  socket.on('voting-start', function(data) {
    console.log("voting start");
    socket.emit('room-code', data.code);
    //sendPlayerNamesForLobby(data.code);
    //io.emit('player-names', rooms[data.code].players); //this func doesnt know what playes is
    //console.log('player-names');
    //getPlayerNamesForVoting(data.code);
  })

  socket.on('reveal-waiting', function(data) {
    console.log("reveal waiting");
    io.emit('reveal-waiting');
  })

  socket.on('reveal-item', function(data) {
    console.log("reveal item");
    io.emit('reveal-item');
  })

  socket.on('players-ready', function(data) {
    console.log("players ready");
    io.emit('players-ready');
  })

});

function sendPlayerNamesForLobby(roomCode) {
  //send the player names to the lobby
  io.sockets.in(roomCode).emit('player-names', rooms[roomCode].players);
  //getPlayerNamesForVoting(roomCode);
}

// function getPlayerNamesForVoting(roomCode) {
//   //display all players in the lobby
//   console.log("getPlayerNamesForVoting called");
//   console.log(arrayOfPlayers);
//   //io.emit('player-names', rooms[roomCode].arrayOfPlayers);
// }

// function emitGameState(roomCode, gameState) {
//   console.log("emitGameState called");
//   io.sockets.in(roomCode).emit('gameState', JSON.stringify(gameState));
// }

function emitNextStageToAll(roomCode) {
  console.log("emitNextStageToAll called");
  io.to(roomCode).emit('nextStage');
}

function displayNextPageToAll(roomCode) {
  console.log("displayNextPageToAll called");
  io.sockets.in(roomCode).emit('nextPage');
}

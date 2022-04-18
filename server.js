//setting up server routing
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//Server-side file handling
app.use(express.static('files'))
app.use(express.static(__dirname + '/public'));
app.listen(port)
console.log("Server running at:"+port);

//Game server-side code

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/app.js');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

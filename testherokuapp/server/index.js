const express = require('express');
const socket = require('socket.io');


const app = express();
const server = app.listen(3000, function(){
    console.log('listening on port 3000');
});

app.use(express.static('../app'));

//socket setup
const io = socket(server);

io.on('connection', function(socket){
    console.log("connected");
    console.log(socket.id);
    socket.on("test", function(data){
        console.log(data);
        io.sockets.emit("message", data.message);
    });
});
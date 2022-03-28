//socketio client express
//create socket.io client
const socket = io.connect("http://localhost:3000");

let btn = document.getElementById("btn");
let msg = document.getElementById("msg").value;

io.emit("test", "hello");

btn.onclick(function() {
    io.emit("test", "hello");
})

socket.on('test', function(data) {
    //add element to the DOM
    output.innerHTML += `<p>${data.message}</p>`;
});
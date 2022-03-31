// create an express app
const express = require("express")
const app = express()
port = process.env.PORT || 80;
const io = require('socket.io')

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// use the express-static middleware
app.use(express.static("public"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
// define the first route
});

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
});


// start the server listening for requests
app.listen(port, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

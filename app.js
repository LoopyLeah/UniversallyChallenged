const express = require('express')
// create an express app
const express = require("express")
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// use the express-static middleware
app.use(express.static("public"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

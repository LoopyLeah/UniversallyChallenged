const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
 res.send('Hello World!');
  for (let i = 1; i <= 10; i++) {
if (i % 2 == 0) {
res.send(i + " is even");
} else {
res.send(i + " is odd");
}
}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


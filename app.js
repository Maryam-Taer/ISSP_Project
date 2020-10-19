var express = require('express');
var path = require('path');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to BCIT" });
});

require('./routes/router')(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

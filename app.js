var express = require('express');
var path = require('path');
var app = express();
const passport = require('passport');
const flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var issp = require("./config/issp_system");

// When the server starts, Check and update the deadlines if it has expired.
issp.check()

// Passport Config
require('./config/passport')(passport);

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// prevent cache data, disallow back-button into restricted content after log-out
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Available path /submission , /submissionList, /login, /register" });
});

require('./routes/router')(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
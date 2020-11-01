var sql = require("../database")
const passport = require('passport');

exports.login = (req, res) => {
    res.render('login')
};

exports.loginuser = (req, res, next) => {
    passport.authenticate('local-login', {
        successRedirect: '/submissionList',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
};

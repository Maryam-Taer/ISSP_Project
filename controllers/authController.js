var sql = require("../database")
const passport = require('passport');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginuser = (req, res, next) => {
    passport.authenticate('local-login', {
        successRedirect: '/submissionList',
        failureRedirect: '/login',
        failureFlash: 'Invalid Credentials'
      })(req, res, next);
};

exports.logoutuser = (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/login'); 
};

exports.register = (req, res, next) => {
    res.render('register_backup');
};

exports.registeruser = (req, res, next) => {
    passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/register_backup',
        failureFlash: true,
        session: false // prevent auto-login
      })(req, res, next);
};
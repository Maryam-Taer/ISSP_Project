var sql = require("../database")
const passport = require('passport');

// Render login Page
exports.login = (req, res) => {
    res.render('login');
};

// Login a user 
exports.loginuser = (req, res, next) => {-
    passport.authenticate('local-login', {
        successRedirect: '/feedbackList',
        failureRedirect: '/login',
        failureFlash: 'Invalid Credentials'
      })(req, res, next);
};

// Logout a user
exports.logoutuser = (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/login'); 
};

// Self-Register page, only use for development
// exports.register = (req, res, next) => {
//     res.render('register_backup');
// };

// Add users by admin
exports.registeruser = (req, res, next) => {
    passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/register_backup',
        failureFlash: true,
        session: false // prevent auto-login
      })(req, res, next);
};
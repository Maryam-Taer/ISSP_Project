const User = require("../models/userModel");
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = (req, res) => {
    res.render('register',{role:req.user.role, username:req.user.username  });
};

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Create a user
    // TODO: need to check if user exist 
    var password1 = req.body.password;
    var password2 = req.body.password2;
    if (password1 == password2){
        var role = (req.body.role) ? req.body.role : "reviewer";
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, saltRounds),
            role: role,
        });
        // Save User in the database
        User.create(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the User."
                });
            // Display in raw data
            // else res.send(data);
            else res.redirect('/submissionList');
        });
    } else{
        res.send("verfiy password and confirm password do not match");
    }
};


exports.profile = async (req,res) => {
    var username = JSON.stringify(req.body.username);
    await User.findByUsername(username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Account with username ${username}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Account with username " + username
                });
            }
        } else res.render('userEdit', { data: data, role: req.user.role, username:req.user.username  });
    });
};


exports.selfprofile = (req,res) => {
    res.render('profile', { role: req.user.role, username: req.user.username  });
};



// TODO: Need to check if password match 
exports.edituser = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateByUsername(
        req.body.username,
        bcrypt.hashSync(req.body.password, saltRounds),
        req.body.role,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Account with username ${req.body.username}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Account with username " + req.body.username
                    });
                }
            } else res.redirect('/submissionList');
        }
    );
};

exports.getAllUsers = async (req, res) => {
    await User.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Submissions."
            });
        else res.render('admin', { userData: data, username:req.body.username, role:req.body.role });
    });
};


exports.delete = (req, res) => {
    if (req.user.role != 'admin'){
        res.status(404).send({
            message: `Your role cannot perform this action!.`
        });
    } else {
        User.delete(req.body.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.body.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete User with id " + req.body.id
                    });
                }
            } else res.redirect('/submissionList');
        });
    }
};
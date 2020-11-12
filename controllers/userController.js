const User = require("../models/userModel");
var bcrypt = require('bcrypt');
const saltRounds = 10;


exports.profile = async (req,res) => {
    var username = JSON.stringify(req.body.username);
    var role = req.body.role;
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
        } else res.render('userEdit', { data: data, role: role, username:req.body.username  });
    });
};


exports.edituser = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    User.updateByUsername(
        req.body.username,
        hash,
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
var sql = require("../database");
var bcrypt = require('bcrypt');

const saltRounds = 10;

const User = function (user) {
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
};


User.findByUsername = (username, result) => {
    sql.query(`SELECT * FROM accounts WHERE username = ${username}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found username: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Account with the username
        result({ kind: "not_found" }, null);
    });
};


User.updateByUsername = (username, hash, role, result) => {
    sql.query(
        "UPDATE accounts SET username = ?, password = ?, role = ? WHERE username = ?",
        [username, hash,role, username],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Account with the username
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated user: ", { username: username, role: role});
            result(null, { username: username});
        }
    );
};







User.getAll = result => {
    sql.query("SELECT * FROM accounts", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        // console.log("submissions: ", res);
        result(null, res);
    });
};


module.exports = User;
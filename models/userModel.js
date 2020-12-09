var sql = require("../database");

// Constructor
const User = function (user) {
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
};

// Receive data from the controller and Insert it into the database
User.create = (newUser, result) => {
    sql.query("select * from accounts where username = ?", newUser.username.toLowerCase(), (err,rows) => {
        if (err)
            result(err, null);
        if (rows.length) {
                result("username is already taken", null);
                return;
        } else {
            sql.query("INSERT INTO accounts SET ?", newUser, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log("created user: ", { id: res.insertId, ...newUser });
                result(null, { id: res.insertId, ...newUser });
            });
        
        }
    });
};


// Get a user by username from the database
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

// Update a user by username in the database
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
            // console.log("updated user: ", { username: username, role: role});
            result(null, { username: username});
        }
    );
};

// Get all users from the database
User.getAll = result => {
    sql.query("SELECT * FROM accounts", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        // console.log("Users: ", res);
        result(null, res);
    });
};


// Delete a user by id in the database
User.delete = (id, result) => {
    sql.query("DELETE FROM accounts WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Submission with the id
            result({ kind: "not_found" }, null);
            return;
        }

        // console.log("deleted submission with id: ", id);
        result(null, res);
    });
};



module.exports = User;
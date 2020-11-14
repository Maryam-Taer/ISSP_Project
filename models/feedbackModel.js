const { closeDelimiter } = require("ejs");
var sql = require("../database");
const moment = require('moment');


// constructor
const Feedback = function (feedback) {
    this.feedback = feedback.feedback;
    this.feedback_time = feedback.feedback_time;
    this.feedback_user = feedback.feedback_user;
    this.project_id = feedback.project_id;
};


// Create feedback
Feedback.create = (newFeedback, result) => {    
    sql.query("INSERT INTO feedback SET ?", newFeedback, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // console.log("created feedback: ", { id: res.insertId, ...newFeedback });
        result(null, { id: res.insertId, ...newFeedback });
    });
};

// Find all feedback by id
Feedback.findAllById = async (id, result) => {
    await sql.query(`SELECT * FROM feedback WHERE project_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        for (var i = 0; i < res.length; i++) {
            res[i].feedback_time = moment(res[i].feedback_time).format("YYYY-MM-DD HH:mm:ss")
        }
        // console.log(res)
        result(null, res);
    });
};


// Update category
Feedback.category = async (id, submission, result) => {
    await sql.query(
        "UPDATE issp SET category = ?, year = ?, term = ? WHERE id = ?",
        [submission.category, submission.year, submission.term, id],
        (err, res) => {
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

            console.log("updated submission: ", { id: id, ...submission });
            result(null, { id: id, ...submission });
        }
    );
};



module.exports = Feedback;


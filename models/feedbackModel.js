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
            res[i].feedback_time = moment(res[i].feedback_time).format("YYYY-MM-DD HH:mm:ss");
        }
        // console.log(res)
        result(null, res);
    });
};


// Update category
Feedback.category = async (id, submission, result) => {
    await sql.query(
        "UPDATE issp SET category = ?, assigned_year = ?, assigned_term = ? WHERE id = ?",
        [submission.category, submission.assigned_year, submission.assigned_term, id],
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


Feedback.getAll = result => {
    sql.query("select t1.id, t1.created_time, t1.category, t1.assigned_year, t1.assigned_term, t1.company_name, t1.project_description , MAX(t2.feedback_time) as last_comment from issp t1 left join feedback t2 on t1.id = t2.project_id group by t1.id order by last_comment desc, t1.id asc", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        for (var i = 0; i < res.length; i++) {
            res[i].created_time = moment(res[i].created_time).format("YYYY-MM-DD HH:mm:ss");
            if (res[i].last_comment != null) {
                res[i].last_comment = moment(res[i].last_comment).format("YYYY-MM-DD HH:mm:ss");
            } else{
                res[i].last_comment = "No Comment Yet";
            }
        }
        // console.log(res)
        result(null, res);
    });
};




module.exports = Feedback;


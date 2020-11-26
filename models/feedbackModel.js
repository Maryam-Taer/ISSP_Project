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

            // console.log("updated submission: ", { id: id, ...submission });
            result(null, { id: id, ...submission });
        }
    );
};


Feedback.getAll = result => {
    sql.query("SELECT t1.id, t1.created_time, t1.category, t1.assigned_year, t1.assigned_term, t1.company_name, t1.project_description,t1.project_area, t1.current_arrangement, t1.programming_language, t1.hardware_software_requirements,t2.feedback_time, t2.feedback_user FROM issp t1 LEFT JOIN feedback t2 ON t2.project_id = t1.id AND t2.feedback_time = (SELECT MAX(feedback_time) FROM feedback WHERE feedback.project_id = t1.id) order by t2.feedback_time desc, t1.id asc;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        for (var i = 0; i < res.length; i++) {
            res[i].created_time = moment(res[i].created_time).format("YYYY-MM-DD HH:mm:ss");
            if (res[i].feedback_time != null) {
                res[i].feedback_time = moment(res[i].feedback_time).format("YYYY-MM-DD HH:mm:ss");
            } else {
                res[i].feedback_time = "No Comment Yet";
            }
        }
        // console.log(res);
        result(null, res);
    });
};




module.exports = Feedback;


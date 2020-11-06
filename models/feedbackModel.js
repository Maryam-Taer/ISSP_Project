const { closeDelimiter } = require("ejs");
var sql = require("../database")


const Feedback = function (feedback) {
    this.feedback = feedback.feedback;
    this.feedback_time = feedback.feedback_time;
    this.feedback_user = feedback.feedback_user;
    this.project_id = feedback.project_id
};




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


Feedback.findAllById = (id, result) => {
    sql.query(`SELECT * FROM feedback WHERE project_id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        // console.log(res)
        result(null, res);
    });
};



// Submission.updateFeedback = (id, submission, result) => {
//     var today = new Date();
//     var date = "," + today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//     var feedback = ",&&" + submission.feedback
//     var username = "," + submission.feedback_user
    
//     sql.query(
//         "UPDATE issp SET feedback = CONCAT(feedback, ?), feedback_time = CONCAT(feedback_time, ?), feedback_user = CONCAT(feedback_user, ?) WHERE id = ?",
//         [feedback, date, username, id],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 result(null, err);
//                 return;
//             }

//             if (res.affectedRows == 0) {
//                 // not found Submission with the id
//                 result({ kind: "not_found" }, null);
//                 return;
//             }

//             // console.log("submitted feedback: ", { id: id, ...submission });
//             result(null, { id: id, ...submission });
//         }
//     );
// };



module.exports = Feedback;


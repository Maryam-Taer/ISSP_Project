const Submission = require("../models/submissionModel");
const Feedback = require("../models/feedbackModel");
const DATE_FORMATER = require('date-format');


// Create and Save a new Feedback
exports.submitFeedback = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Create a submission
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const feedback = new Feedback({
        feedback: req.body.feedback,
        feedback_time: date,
        feedback_user: req.body.feedback_user,
        project_id: req.body.project_id
    });


    // Save Submission in the database
    Feedback.create(feedback, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Submission."
            });
        // Display in raw data
        // else res.send(data);
        else res.redirect('/submissionList')
    });
}

// Feedback Page
exports.feedback = async (req, res) => {
    var username = req.body.username
    await Submission.findById(req.body.id, (err, submissionData) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Submission with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Submission with id " + req.params.id
                });
            }
        } else Feedback.findAllById(req.body.id, (err, data) => {
            if (err){
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Submissions."
            });
        }
        else {res.render('feedback', { returnData: data , feedbackData: submissionData, userData: username })};
        });
    });
    
};

// exports.submitFeedback = (req, res) => {
//     // Validate Request
//     if (!req.body) {
//         res.status(400).send({
//             message: "Content can not be empty!"
//         });
//     }
//     const obj = JSON.parse(JSON.stringify(req.body));
//     // console.log(obj)
//     Submission.updateFeedback(
//         req.body.id,
//         new Submission(obj),
//         (err, data) => {
//             if (err) {
//                 if (err.kind === "not_found") {
//                     res.status(404).send({
//                         message: `Not found Submission with id ${req.body.id}.`
//                     });
//                 } else {
//                     res.status(500).send({
//                         message: "Error updating Submission with id " + req.body.id
//                     });
//                 }
//             } else res.redirect('/submissionList')
//         }
//     );
// };



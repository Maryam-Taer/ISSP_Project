var async = require("async")
const Submission = require("../models/submissionModel");
var issp = require("../config/issp_system");
var nodemailer = require('nodemailer');
var mailer = require("../config/nodemailer");
var transport = nodemailer.createTransport(mailer);
var temp_email = require("../config/email_response")

// confirm mailing server is up and running
transport.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Mailing Server is up");
    }
});

// Render an index pagem submission
exports.index = (req, res) => {
    res.render('submission');
};

// Create and Save a new Submission
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Check inputs received from the submission form, Convert to the default value if necessary
    var project_area_trans = (req.body.project_area) ? req.body.project_area.toString() : "empty";
    var hear_about_ISSP = (req.body.hear_about_ISSP == "Other") ? req.body.hear_about_ISSP_other : req.body.hear_about_ISSP;
    var submission_time = new Date();
    // Check and update the deadline if it has expired.
    issp.check();

    // Get the submission tag to assign term and year for project
    var submission_tag = issp.get_submission_tag();

    // Create a submission
    const submission = new Submission({
        company_name: req.body.company_name,
        category: "Not Assigned",
        created_time: submission_time,
        street_address: req.body.street_address,
        address_line_2: req.body.address_line_2,
        city: req.body.city,
        province: req.body.province,
        postal_code: req.body.postal_code,
        phone: req.body.phone,
        website: req.body.website,
        non_profit_organization: req.body.non_profit_organization || "unchecked",
        company_business_profile: req.body.company_business_profile,
        prefix: req.body.prefix,
        first: req.body.first,
        last: req.body.last,
        position: req.body.position,
        personal_phone: req.body.personal_phone,
        email: req.body.email,
        project_area: project_area_trans,
        project_description: req.body.project_description,
        project_duration: req.body.project_duration,
        project_duration_no_preference: req.body.project_duration_no_preference || "unchecked",
        current_arrangement: req.body.current_arrangement,
        programming_language: req.body.programming_language,
        hardware_software_requirements: req.body.hardware_software_requirements,
        continuation_project: req.body.continuation_project,
        hear_about_ISSP: hear_about_ISSP,
        sponsor_commitments: req.body.sponsor_commitments || "unchecked",
        privacy_policy: req.body.privacy_policy || "unchecked",
        assigned_year: submission_tag[0],
        assigned_term: submission_tag[1]
    });

    // Save Submission in the database
    Submission.create(submission, (err, data) => {
        if (err)
            res.render('error', { message: "Some error occurred while creating the Submission." });
        // Display in raw data
        // else res.send(data);
        else {
            /* TODO - Automatic email response, need to update the message based on submission content
            var temp_content = temp_email
            temp_content.to = req.body.email
            transport.sendMail(temp_content, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                res.render('submission_success', { submission: JSON.stringify(req.body) });
              });
            */
            res.render('submission_success', { submission: JSON.stringify(req.body) });
        }
    });
};

// Fetch all the data, for old page, not in use
// exports.getAll = async (req, res) => {
//     if (req.user.role != 'admin') {
//         res.render( 'error', {message: `Your role cannot visit this page!`, role:req.user.role, username:req.user.username}
//         );
//     } else {
//         async.parallel(
//             [
//                 Submission.getAll,
//                 Submission.get_year_term
//             ],
//             function (err, results) {
//                 if (err){
//                     res.render('error', { message: "Some error occurred while retrieving the Submissions.", role: req.user.role, username: req.user.username });
//                 }else {
//                     res.render('submissionList', { title: 'submission List', submissionData: JSON.stringify(results[0]), year_term: JSON.stringify(results[1]), username: req.user.username, role: req.user.role });
//                 }
//             }
//         );
//     }
// };

//  Delete a submission by id
exports.delete = (req, res) => {
    if (req.user.role != 'admin') {
        res.render( 'error', {message: `Your role cannot perform this action!`, role:req.user.role, username:req.user.username}
        );
    } else {
        Submission.delete(req.body.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.render('error', { message: `Not found Submission with id ${req.body.id}.`, role: req.user.role, username: req.user.username });
                } else {
                    res.render('error', { message: `Could not delete Submission with id ${req.body.id}.`, role: req.user.role, username: req.user.username });
                }
            } else {
                res.redirect('/feedbackList');
            }
        });
    }
};

// Edit a submission by id
exports.edit = async (req, res) => {
    if (req.user.role != 'admin') {
        res.render( 'error', {message: `Your role cannot perform this action!`, role:req.user.role, username:req.user.username}
        );
    } else {
        await Submission.findById(req.query.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.render('error', { message: `Not found Submission with id ${req.params.id}.`, role: req.user.role, username: req.user.username });
                } else {
                    res.render('error', { message: `Error retrieving Submission with id ${req.params.id}.`, role: req.user.role, username: req.user.username });
                }
            } else {
                res.render('edit', { data: data , username: req.user.username, role: req.user.role});
            }
        });
    }
};

//  Update a submssion by id
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Role based access
    if (req.user.role != 'admin') {
        res.render( 'error', {message: `Your role cannot perform this action!`, role:req.user.role, username:req.user.username});
    } else {
        Submission.updateById(
            req.body.id,
            new Submission(req.body),
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.render( 'error', {message: `Not found Submission with id ${req.body.id}.`, role:req.user.role, username:req.user.username});
                    } else {
                        res.render( 'error', {message: `Error updating Submission with id ${req.body.id}.`, role:req.user.role, username:req.user.username});
                    }
                } else {
                    res.redirect('/feedbackList');
                }
            }
        );
    }
};
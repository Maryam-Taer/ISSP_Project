const Submission = require("../models/submissionModel");
const DATE_FORMATER = require('date-format');

exports.index = (req, res) => {
    res.render('submission')
};


// Create and Save a new Submission
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    var project_area_trans = (req.body.project_area) ? req.body.project_area.toString() : "empty";

    // Create a submission
    const submission = new Submission({
        company_name: req.body.company_name,
        created_time: DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss"),
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
        hear_about_ISSP: req.body.hear_about_ISSP,
        sponsor_commitments: req.body.sponsor_commitments
    });


    // Save Submission in the database
    Submission.create(submission, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Submission."
            });
        // Display in raw data
        // else res.send(data);
        else res.render('submission')
    });
}

exports.getAll = (req, res) => {
    Submission.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving the Submissions."
            });
        else res.render('submissionList', { title: 'submission List', submissionData: data });
    });
};

exports.delete = (req, res) => {
    Submission.delete(req.body.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Submission with id ${req.body.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Submission with id " + req.body.id
                });
            }
        } else res.send({ message: `Submission was deleted successfully!` });
    });
};
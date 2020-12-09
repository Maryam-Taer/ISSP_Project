var async = require("async");
const submission = require("../models/submissionModel");

// Get all proejcts by term, year, and category
exports.getAllForPDFPage = async (req, res) => {
    await submission.getAllBy_year_term_program(req.query.term, req.query.year, req.query.category, (err, data) => {
        if (err){
            res.render('error', { message: "Some error occurred while retrieving the Submissions.", role: req.user.role, username: req.user.username });
        } else {
            res.render('student_catalogue', { title: 'Student Catalogue Page', submissionData: JSON.stringify(data), year: req.query.year, term: req.query.term, program: req.query.category, username: req.user.username, role: req.user.role });
        }
    });
};

// Render a page to generate a pdf
exports.get_year_term_category = async (req, res) => {
    async.parallel(
        [
            submission.get_year_term
        ],
        function (err, results) {
            if (err){
                res.render('error', { message: "Some error occurred while retrieving the Submissions.", role: req.user.role, 
                username: req.user.username });
            }else {
                res.render('pdfSubmissionPage', { title: 'PDF Submission Page', year_term: JSON.stringify(results[0]), username: req.user.username, role: req.user.role });
            }
        }
    );
};

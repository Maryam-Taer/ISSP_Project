var issp = require("../config/issp_system");

exports.get_stats = (req, res) => {
    if (req.user.role != 'admin'){
        res.status(404).send({
            message: `Your role cannot perform this action!.`
        });
    } else {
        var deadline = issp.get_deadline();
        var submission_tag = issp.get_submission_tag();
        res.render('system', { title: 'System Variable', deadline: deadline, tag: submission_tag , username: req.user.username, role: req.user.role});
    }
};

exports.set_stats = (req, res) => {
    if (req.user.role != 'admin'){
        res.status(404).send({
            message: `Your role cannot perform this action!.`
        });
    } else {
        const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let deadline_date = req.body.deadline.split("-");
        issp.update_stat(deadline_date[0], months[parseInt(deadline_date[1])-1], deadline_date[2], req.body.submission_year, req.body.submission_term, req, res);
        res.redirect('/system'); 
    }
};
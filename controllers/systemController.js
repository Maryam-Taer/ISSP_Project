var issp = require("../config/issp_system");

exports.get_stats = (req, res) => {
    if (req.user.role != 'admin'){
        res.status(404).send({
            message: `Your role cannot perform this action!.`
        });
    } else {
        var deadline = issp.get_deadline()
        var submission_tag = issp.get_submission_tag()
        res.render('system', { title: 'System Variable', deadline: deadline, tag: submission_tag , username: req.user.username, role: req.user.role});
    }
};

exports.set_stats = (req, res) => {
    if (req.user.role != 'admin'){
        res.status(404).send({
            message: `Your role cannot perform this action!.`
        });
    } else {
        issp.update_stat(req.body.year, req.body.month, req.body.day, req.body.submission_year, req.body.submission_term)
        req.flash('success_msg', 'Updated system Successfully!');
        res.redirect('/system'); 
    }
};
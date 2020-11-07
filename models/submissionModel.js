const { closeDelimiter } = require("ejs");
var sql = require("../database")
const moment = require('moment');


// constructor
const Submission = function (submission) {
    this.company_name = submission.company_name;
    this.created_time = submission.created_time;
    this.category = submission.category;
    this.year = submission.year;
    this.term = submission.term;
    this.street_address = submission.street_address;
    this.address_line_2 = submission.address_line_2;
    this.city = submission.city;
    this.province = submission.province;
    this.postal_code = submission.postal_code;
    this.phone = submission.phone;
    this.website = submission.website;
    this.non_profit_organization = submission.non_profit_organization;
    this.company_business_profile = submission.company_business_profile;
    this.prefix = submission.prefix;
    this.first = submission.first;
    this.last = submission.last;
    this.position = submission.position;
    this.personal_phone = submission.personal_phone;
    this.email = submission.email;
    this.project_area = submission.project_area;
    this.project_description = submission.project_description;
    this.project_duration = submission.project_duration;
    this.project_duration_no_preference = submission.project_duration_no_preference;
    this.current_arrangement = submission.current_arrangement;
    this.programming_language = submission.programming_language;
    this.hardware_software_requirements = submission.hardware_software_requirements;
    this.continuation_project = submission.continuation_project;
    this.hear_about_ISSP = submission.hear_about_ISSP;
    this.sponsor_commitments = submission.sponsor_commitments;
};




Submission.create = (newSubmission, result) => {
    sql.query("INSERT INTO issp SET ?", newSubmission, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created submission: ", { id: res.insertId, ...newSubmission });
        result(null, { id: res.insertId, ...newSubmission });
    });
};

Submission.getAll = result => {
    sql.query("SELECT * FROM issp", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        for (var i = 0; i < res.length; i++) {
            res[i].created_time = moment(res[i].created_time).format("YYYY-MM-DD HH:mm:ss")
        };

        // console.log("submissions: ", res);
        result(null, res);
    });
};


Submission.delete = (id, result) => {
    sql.query("DELETE FROM issp WHERE id = ?", id, (err, res) => {
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

        // console.log("deleted submission with id: ", id);
        result(null, res);
    });
};


Submission.findById = (id, result) => {
    sql.query(`SELECT * FROM issp WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            // console.log("found submission: ", res[0]);
            for (var i = 0; i < res.length; i++) {
                res[i].created_time = moment(res[i].created_time).format("YYYY-MM-DD HH:mm:ss")
            };
            result(null, res[0]);
            return;
        }

        // not found Submission with the id
        result({ kind: "not_found" }, null);
    });
};


Submission.updateById = (id, submission, result) => {
    var project_area_trans = (submission.project_area) ? submission.project_area.toString() : "empty";
    var non_profit_organization_trans = (submission.non_profit_organization) ? submission.non_profit_organization : "unchecked";
    var project_duration_no_preference_trans = (submission.project_duration_no_preference) || "unchecked";

    sql.query(
        "UPDATE issp SET company_name = ?,street_address = ?, address_line_2 = ?, city = ?, province = ?, postal_code = ?, phone = ?, website = ?, non_profit_organization = ?, company_business_profile = ?, prefix = ?, first = ?, last = ?, position = ?, personal_phone = ?, email = ?, project_area = ?, project_description = ?, project_duration = ?, project_duration_no_preference = ?, current_arrangement = ?, programming_language = ?, hardware_software_requirements = ?, continuation_project = ?, hear_about_ISSP = ?, sponsor_commitments = ? WHERE id = ?",
        [submission.company_name, submission.street_address, submission.address_line_2, submission.city, submission.province, submission.postal_code, submission.phone, submission.website, non_profit_organization_trans, submission.company_business_profile, submission.prefix, submission.first, submission.last, submission.position, submission.personal_phone, submission.email, project_area_trans, submission.project_description, submission.project_duration, project_duration_no_preference_trans, submission.current_arrangement, submission.programming_language, submission.hardware_software_requirements, submission.continuation_project, submission.hear_about_ISSP, submission.sponsor_commitments, id],
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

module.exports = Submission;


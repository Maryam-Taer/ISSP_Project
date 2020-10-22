var sql = require("../database")


// constructor
const Submission = function (submission) {
    this.company_name = submission.company_name;
    this.created_time = submission.created_time;
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

        console.log("submissions: ", res);
        result(null, res);
    });
};


module.exports = Submission;


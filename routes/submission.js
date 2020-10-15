var express = require('express');
var router = express.Router();
var db = require('../database');
const DATE_FORMATER = require('dateformat');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('submission');
});


// Post receive input from the submission
router.post('/create', function (req, res, next) {

  var company_name = req.body.company_name;
  var created_time = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss")
  var street_address = req.body.street_address;
  var address_line_2 = req.body.address_line_2;
  var city = req.body.city;
  var province = req.body.province;
  var postal_code = req.body.postal_code;
  var phone = req.body.phone;
  var website = req.body.website;
  var non_profit_organization = req.body.non_profit_organization || "unchecked";
  var company_business_profile = req.body.company_business_profile;
  var prefix = req.body.prefix;
  var first = req.body.first;
  var last = req.body.last;
  var position = req.body.position;
  var personal_phone = req.body.personal_phone;
  var email = req.body.email;
  var project_area = req.body.project_area || "empty";
  var project_description = req.body.project_description;
  var project_duration = req.body.project_duration;
  var project_duration_no_preference = req.body.project_duration_no_preference || "unchecked";
  var current_arrangement = req.body.current_arrangement;
  var programming_language = req.body.programming_language;
  var hardware_software_requirements = req.body.hardware_software_requirements;
  var continuation_project = req.body.continuation_project;
  var hear_about_ISSP = req.body.hear_about_ISSP;
  var sponsor_commitments = req.body.sponsor_commitments;

  var sql = `INSERT INTO issp (company_name, created_time, street_address, address_line_2, city, province, postal_code, phone, website, non_profit_organization, company_business_profile, prefix, first, last, position, personal_phone, email, project_area, project_description, project_duration, project_duration_no_preference, current_arrangement, programming_language, hardware_software_requirements, continuation_project, hear_about_ISSP, sponsor_commitments) VALUES 
  ('${company_name}', '${created_time}', '${street_address}', '${address_line_2}', '${city}', '${province}', '${postal_code}', '${phone}', '${website}', '${non_profit_organization}', '${company_business_profile}', '${prefix}', '${first}', '${last}', '${position}', '${personal_phone}', '${email}', '${project_area}', '${project_description}', '${project_duration}', '${project_duration_no_preference}', '${current_arrangement}', '${programming_language}', '${hardware_software_requirements}', '${continuation_project}', '${hear_about_ISSP}', '${sponsor_commitments}' )`;
  db.query(sql, function (err, data) {
    if (err) throw err;
    console.log("record inserted");
  });
  res.redirect('/submission');
});

module.exports = router;

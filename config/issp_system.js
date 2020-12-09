var issp_system = require("../config/issp_system.json");
var fs = require('fs');

module.exports = {
    // Function to verify and updated deadline for submissions.
    check: () => {
        // get current server time
        var temp_date = new Date();
        // extract year from server time
        var temp_year = temp_date.getFullYear();
        // Parse a Date object from deadline saved in JSON file
        var deadline = Date.parse(issp_system.next_deadline.day + " " + issp_system.next_deadline.month + " " + issp_system.next_deadline.year);
        var loop_count = 0;
        // Update the deadline and submission tag in JSON file when the old deadline has passed. 
        // A while loop is used to ensure new deadline is updated correctly
        while (temp_date > deadline) {
            // when the expired submission deadline is for winter term
            if (issp_system.submission_to_term == "winter") {
                // If submission is in same year as the winter term submission deadline 
                if (temp_year == issp_system.next_deadline.year) {
                    // Update new deadline to be Next Year's summer term default deadline
                    issp_system.next_deadline = {
                        "year": (parseInt(issp_system.next_deadline.year) + 1).toString(),
                        "month": issp_system.default_summer_deadline.month,
                        "day": issp_system.default_summer_deadline.day
                    };
                    // Update Tags to assign future submissions to Next Year's Summer 
                    issp_system.submission_to_term = "summer";
                    issp_system.submission_to_year = (temp_year + 1).toString();
                } else {
                    // When deadline is not the same year as submission 
                    // Update new deadline to be Next Year's summer term default deadline
                    issp_system.next_deadline = {
                        "year": (parseInt(issp_system.next_deadline.year) + 1).toString(),
                        "month": issp_system.default_summer_deadline.month,
                        "day": issp_system.default_summer_deadline.day
                    };
                    // Update Tags to assign future submissions to Next Year's Summer 
                    issp_system.submission_to_term = "summer";
                    issp_system.submission_to_year = temp_year.toString();
                }
                // when the expired submission deadline is for summer term
            } else if (issp_system.submission_to_term == "summer") {
                // Update new deadline to be This Year's fall term default deadline
                issp_system.next_deadline = {
                    "year": issp_system.next_deadline.year,
                    "month": issp_system.default_fall_deadline.month,
                    "day": issp_system.default_fall_deadline.day
                };
                // Update Tags to assign future submissions to This Year's fall
                issp_system.submission_to_term = "fall";
                issp_system.submission_to_year = temp_year.toString();
                // when the expired submission deadline is for fall term
            } else if (issp_system.submission_to_term == "fall") {
                // Update new deadline to be This Year's winter term default deadline
                issp_system.next_deadline = {
                    "year": issp_system.next_deadline.year,
                    "month": issp_system.default_winter_deadline.month,
                    "day": issp_system.default_winter_deadline.day
                };
                // Update Tags to assign future submissions to Next Year's winter
                issp_system.submission_to_term = "winter";
                issp_system.submission_to_year = (parseInt(issp_system.next_deadline.year) + 1).toString();
            }
            // Update deadline variable for while loop
            deadline = Date.parse(issp_system.next_deadline.day + " " + issp_system.next_deadline.month + " " + issp_system.next_deadline.year);
            // add a count of while loop to check if the deadline updated
            loop_count += 1;
        } // END While Loop

        // if deadline updated, write the updated changes to a JSON file
        if (loop_count > 0) {
            fs.readFile("./config/issp_system.json", function (err, content) {
                if (err) {
                    res.status(500).send({
                        message: `Error reading system file.`
                    });
                } else {
                    fs.writeFile("./config/issp_system.json", JSON.stringify(issp_system), function (err) {
                        if (err) {
                            res.status(500).send({
                                message: `Error writing to system file.`
                            });
                        }
                    });
                }
            });
        }
    },// END check function
    get_deadline: () => {
        return issp_system.next_deadline;
    },
    get_submission_tag: () => {
        return [issp_system.submission_to_year, issp_system.submission_to_term];
    },
    update_stat: (year, month, day, submission_year, submission_term, req, res) => {
        temp_deadline = {
            "year": year,
            "month": month,
            "day": day
        };
        if ((JSON.stringify(issp_system.next_deadline) == JSON.stringify(temp_deadline)) && (issp_system.submission_to_year == submission_year) && (issp_system.submission_to_term == submission_term)) {
            req.flash('error_msg', 'Nothing has changed!');
        } else {
            issp_system.next_deadline = temp_deadline;
            issp_system.submission_to_year = submission_year;
            issp_system.submission_to_term = submission_term;
            fs.readFile("./config/issp_system.json", function (err, content) {
                if (err) {
                    res.status(500).send({
                        message: `Error reading system file.`
                    });
                } else {
                    fs.writeFile("./config/issp_system.json", JSON.stringify(issp_system), function (err) {
                        if (err) {
                            res.status(500).send({
                                message: `Error writing to system file.`
                            });
                        }
                    });
                }
            });
            req.flash('success_msg', 'Updated system Successfully!');
        }
    }
};
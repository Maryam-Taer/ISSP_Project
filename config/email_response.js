var subject = `Your project [name] has been successfully submitted`;
var message = `If your project is a good match for our courses, it will be added to the project pool. 
You'll be notified by the end of December 2020 if this is the case.

If your project is not a good match for our courses, we will also let you know by the end of December 2020.

If a student team selects your project from the pool, they will contact you between January 11 and 22, 2021, 
to kick off the project. They will be ready to start right away and will need to meet with you very quickly to keep things on schedule.

If the students do not select your project, you'll be notified by late January. 
You will have the option to revise your project description if you would like the project to be carried over into the following term's selection pool.

Meanwhile, please contact us if you have any questions.`;

//Replace with your message
module.exports = {
    from: '"BCIT ISSP" <no-reply@issp.bcit.ca>',
    to: '',
    subject: subject,
    text: message,
    html: '',
};
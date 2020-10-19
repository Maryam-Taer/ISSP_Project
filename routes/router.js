var submissionController = require("../controllers/submissionController");


module.exports = app => {
  app.get('/submission', submissionController.index);
  // Create a new Submission
  app.post("/submission/create", submissionController.create);
};
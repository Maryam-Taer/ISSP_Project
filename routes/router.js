var submissionController = require("../controllers/submissionController");


module.exports = app => {
  app.get("/submission", submissionController.index);
  // Create a new Submission
  app.post("/submission/create", submissionController.create);
  // Fetch all the data
  app.get("/submissionList", submissionController.getAll)
  // Delete a project
  app.post("/submission/delete", submissionController.delete)
  // Display an eidt form
  app.get("/submission/edit", submissionController.edit);
  // Edit a project
  app.post('/submission/update', submissionController.update);
};
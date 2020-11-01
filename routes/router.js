var submissionController = require("../controllers/submissionController");
var authController = require("../controllers/authController");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

module.exports = app => {
  app.get("/submission", submissionController.index);
  // Create a new Submission
  app.post("/submission/create", submissionController.create);
  // Fetch all the data
  app.get("/submissionList", ensureAuthenticated, submissionController.getAll)
  // Delete a project
  app.post("/submission/delete", submissionController.delete)
  // Display an eidt form
  app.get("/submission/edit", submissionController.edit);
  // Edit a project
  app.post("/submission/update", submissionController.update);
  // Login Page
  app.get("/login", forwardAuthenticated, authController.login);
  // Login User
  app.post("/login", authController.loginuser);
};
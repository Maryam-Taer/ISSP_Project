var submissionController = require("../controllers/submissionController");
var authController = require("../controllers/authController");
var feedbackController = require("../controllers/feedbackController");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

module.exports = app => {
  app.get("/submission", submissionController.index);
  // Create a new Submission
  app.post("/submission/create", submissionController.create);
  // Fetch all the data
  app.get("/submissionList", ensureAuthenticated, submissionController.getAll)
  // Delete a project
  app.post("/submission/delete", ensureAuthenticated, submissionController.delete)
  // Eidt Page
  app.get("/submission/edit", ensureAuthenticated, submissionController.edit);
  // Edit a project
  app.post("/submission/update", ensureAuthenticated, submissionController.update);
  // Feedback Page
  app.post("/submission/feedback",ensureAuthenticated, feedbackController.feedback);
  // Submit Feedback
  app.post("/submission/submitFeedback",ensureAuthenticated, feedbackController.submitFeedback);
  // Login Page
  app.get("/login", forwardAuthenticated, authController.login);
  // Login User
  app.post("/login", authController.loginuser);
  // Logout User
  app.get("/logout", authController.logoutuser);
  // Register Page
  app.get("/register", forwardAuthenticated, authController.register);
  // Register User
  app.post("/register", authController.registeruser);

};
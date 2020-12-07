var submissionController = require("../controllers/submissionController");
var authController = require("../controllers/authController");
var feedbackController = require("../controllers/feedbackController");
var userController = require("../controllers/userController");
var systemController = require("../controllers/systemController");
var pdfController = require("../controllers/pdfController");
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

module.exports = app => {
  app.get("/", (req, res) => {
    res.render('submission');
  });
  app.get("/submission", submissionController.index);
  // Create a new Submission
  app.post("/submission/create", submissionController.create);
  // Fetch all the data, for old page, not in use
  // app.get("/submissionList", ensureAuthenticated, submissionController.getAll);
  // Delete a project
  app.post("/submission/delete", ensureAuthenticated, submissionController.delete);
  // Eidt Page
  app.get("/submission/edit", ensureAuthenticated, submissionController.edit);
  // Edit a project
  app.post("/submission/update", ensureAuthenticated, submissionController.update);
  // Feedback List Page
  app.get("/feedbackList", ensureAuthenticated, feedbackController.feedbackList);
  // Feedback Page
  app.get("/submission/feedback",ensureAuthenticated, feedbackController.feedback);
  // Submit Feedback
  app.post("/submission/submitFeedback",ensureAuthenticated, feedbackController.submitFeedback);
  // Update Category
  app.post("/submission/updateCategory",ensureAuthenticated, feedbackController.updateCategory);
  // Login Page
  app.get("/login", forwardAuthenticated, authController.login);
  // Login User
  app.post("/login", authController.loginuser);
  // Logout User
  app.get("/logout", authController.logoutuser);
  // Fetch required data for the PDF page
  app.get("/pdfSubmissionPage", ensureAuthenticated, pdfController.get_year_term_category);
  // Fetch required data for the PDF page
  app.get("/student_catalogue", ensureAuthenticated, pdfController.getAllForPDFPage);
  // // Back up of User Register Page, Remove in production
  // app.get("/register_backup", authController.register);
  // // Back up of User Register Page, Remove in production
  // app.post("/register_backup", authController.registeruser);

  // User Profile Page
  app.get("/profile",ensureAuthenticated, userController.selfprofile);
  // User Eidt Page
  app.get("/userProfile", ensureAuthenticated, userController.profile);
  // Edit User
  app.post("/user/edit",ensureAuthenticated, userController.edituser);
  // Admin Page
  app.get("/admin", ensureAuthenticated, userController.getAllUsers);
  // Delete User
  app.post("/user/delete", ensureAuthenticated, userController.delete);
  // Add User Page
  app.get("/register", ensureAuthenticated, userController.register);
  // Add User
  app.post("/user/add", ensureAuthenticated, userController.create);
  // System Page
  app.get("/system", ensureAuthenticated, systemController.get_stats);
  // Update System Variable
  app.post("/system/update", ensureAuthenticated, systemController.set_stats);

  // Handle unassigned GET request
  app.get('*', function(req, res) {
    // if user is authenticated, redirect to dashboard home page
    if (req.isAuthenticated()){
      res.redirect("/feedbackList");
    }else{
      // if user is not authenticated, redirect to submission page.
      res.redirect("/");
    }
  }); 
};
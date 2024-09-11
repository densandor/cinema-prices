const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the function which is called when the endpoint is reached
const recommendationsController = require("../controllers/recommendationsController");

//recommendations endpoint only accessible to users and admins
router.get(
	"/",
	authRoles(["user", "admin"]),
	recommendationsController.handleRecommendations
);

module.exports = router;

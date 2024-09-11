const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the function which is called when the endpoint is reached
const updateMoviesController = require("../controllers/updateMoviesController");

//endpoint to add new movies to the database, only accessible to admins
router.get(
	"/",
	authRoles(["admin"]),
	updateMoviesController.handleGetNewMovies
);

module.exports = router;

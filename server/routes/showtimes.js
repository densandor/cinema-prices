const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the function which is called when the endpoint is reached
const showtimesController = require("../controllers/showtimesController");

//endpoint to retrieve new showtimes
router.post(
	"/cineworld",
	authRoles(["admin"]),
	showtimesController.handleCineworldShowtimes
);
router.post(
	"/vue",
	authRoles(["admin"]),
	showtimesController.handleVueShowtimes
);

router.post("/", authRoles(["admin"]), showtimesController.handleAddShowtime);

module.exports = router;

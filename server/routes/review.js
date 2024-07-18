const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const {
	reviewSchema,
	movieIdSchema,
	deleteReviewSchema,
} = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const reviewController = require("../controllers/reviewController");

//endpoint to get all reviews for a movie with validation for the movie id
router.get("/", validateData(movieIdSchema), reviewController.getReviews);
//endpoint to add a new review, accessible to users and admins, validated according to the review schema
router.post(
	"/",
	authRoles(["user", "admin"]),
	validateData(reviewSchema),
	reviewController.saveReview
);
//endpoint to delete reviews, only accessible to users and admins
router.delete(
	"/",
	authRoles(["user", "admin"]),
	validateData(deleteReviewSchema),
	reviewController.deleteReview
);

module.exports = router;

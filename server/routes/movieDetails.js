const express = require("express");
const router = express.Router();

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const { movieIdSchema } = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const movieDetailsController = require("../controllers/movieDetailsController");

//movie details endpoint, validated for the movie ids
router.get(
	"/",
	validateData(movieIdSchema),
	movieDetailsController.handleMovieDetails
);

module.exports = router;

const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const { genreSchema } = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const genreController = require("../controllers/genreController");

//genres endpoint which gets all available genres
router.get("/", genreController.handleGetGenres);

//genres endpoint to update user genres, accessible to users and admins and validated according to the genre schema
router.post(
	"/",
	authRoles(["user", "admin"]),
	validateData(genreSchema),
	genreController.handleUpdateUserGenres
);

module.exports = router;

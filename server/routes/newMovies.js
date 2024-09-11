const express = require("express");
const router = express.Router();

//imports the function which is called when the endpoint is reached
const newMoviesController = require("../controllers/newMoviesController");

//latest movies endpoint
router.get("/", newMoviesController.handleGetLatestMovies);

module.exports = router;

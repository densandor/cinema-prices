const express = require("express");
const router = express.Router();

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const { searchSchema } = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const searchController = require("../controllers/searchController");

//movie search endpoint which is validated according to the search schema
router.get("/", validateData(searchSchema), searchController.handleSearch);

module.exports = router;

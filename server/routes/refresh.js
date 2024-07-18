const express = require("express");
const router = express.Router();

//imports the function which is called when the endpoint is reached
const refreshController = require("../controllers/refreshController");

//refresh endpoint to check if a user is logged in
router.get("/", refreshController.handleRefresh);

module.exports = router;

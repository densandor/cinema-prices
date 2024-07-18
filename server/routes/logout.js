const express = require("express");
const router = express.Router();

//imports the function which is called when the endpoint is reached
const logoutController = require("../controllers/logoutController");

//logout endpoint
router.get("/", logoutController.handleLogout);

module.exports = router;

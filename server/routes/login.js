const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const {
	loginSchema,
	passwordSchema,
} = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const loginController = require("../controllers/loginController");

//login endpoint, validated according to the login schema
router.post("/", validateData(loginSchema), loginController.handleLogin);
//password change endpoint, only accessible to users and admins and validated according to the password requirements
router.patch(
	"/",
	authRoles(["user", "admin"]),
	validateData(passwordSchema),
	loginController.handlePasswordChange
);

module.exports = router;

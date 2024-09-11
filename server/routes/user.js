const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const {
	registerSchema,
	userSchema,
} = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const userController = require("../controllers/userController");

//registration endpoint, validated according to the registration schema
router.post("/", validateData(registerSchema), userController.createUser);
//edit user endpoint, accessible to users and admins and validated by the user schema
router.patch(
	"/",
	authRoles(["user", "admin"]),
	validateData(userSchema),
	userController.updateUser
);

module.exports = router;

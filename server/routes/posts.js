const express = require("express");
const router = express.Router();

//imports the middleware to authenticate users
const authRoles = require("../auth/authMiddleware");

//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const { postSchema, postIdSchema } = require("../validation/validationSchemas");

//imports the function which is called when the endpoint is reached
const postsController = require("../controllers/postsController");

//endpoint to get all posts
router.get("/", postsController.getPosts);
//endpoint to add a new post, accessible to admins, validated according to the posts schema
router.post(
	"/",
	authRoles(["admin"]),
	validateData(postSchema),
	postsController.createPost
);
//endpoint to delete posts, only accessible to admins
router.delete(
	"/",
	authRoles(["admin"]),
	validateData(postIdSchema),
	postsController.deletePost
);

module.exports = router;

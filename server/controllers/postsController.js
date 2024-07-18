//imports the functions which are used to access the database
const postsRepo = require("../repositories/postsRepository");

//gets all posts for a movie
const getPosts = async (req, res) => {
	try {
		//gets an array of posts from database
		const posts = await postsRepo.getPosts();
		//returns the posts to the frontend
		return res.status(200).json({ postsArr: posts });
	} catch (err) {
		//returns an error
		return res.status(500).json({ message: err.message });
	}
};

//creates a post and adds the details to the database
const createPost = async (req, res) => {
	//gets values from request
	const { title, content, date } = req.body;
	//gets the user id of the currently logged in user
	const user_id = req.session.user.user_id;
	try {
		//adds a new post to the database
		await postsRepo.createPost(user_id, content, title, date);
		//returns success message
		return res.status(200).json({ message: "Post created successfully" });
	} catch (err) {
		//returns an error if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};

//deletes a post
const deletePost = async (req, res) => {
	//gets movie id from the request
	const { post_id } = req.body;
	try {
		//checks if the post exists
		const existingPost = await postsRepo.isPostExists(post_id);
		if (!existingPost) {
			//returns error message if no post is found
			return res.status(400).json({
				message: "This post cannot be deleted because it does not exist",
			});
		}
		//deletes the post from the database
		await postsRepo.deletePost(post_id);
		//returns success message
		return res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		//returns error message if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { getPosts, createPost, deletePost };

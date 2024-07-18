//imports the connection to the database
const db = require("../config/connector");

//creates a post with all details
const createPost = async (user_id, content, title, date) => {
	//inserts the post into the database
	await db.query(
		"INSERT INTO posts (user_id, post_content, post_title, post_date) VALUES (?,?,?,?)",
		[user_id, content, title, date]
	);
};

//gets all posts for a movie
const getPosts = async () => {
	//gets the posts from the database as well as the username of the person that created it
	const [posts] = await db.execute(
		"SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.user_id"
	);
	//returns the posts
	return Promise.resolve(posts);
};

//deletes a post based on post_id
const deletePost = async (post_id) => {
	//deletes the post from the database
	await db.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
};

//checks if a post is in the database
const isPostExists = async (post_id) => {
	//gets the post from the database
	const [post] = await db.execute(
		"SELECT post_title FROM posts WHERE post_id = ?;",
		[post_id]
	);
	//checks if anything is returned
	if (post.length == 0) {
		//returns false if nothing is gotten
		return Promise.resolve(false);
	} else {
		//returns true otherwise
		return Promise.resolve(true);
	}
};

module.exports = {
	createPost,
	getPosts,
	deletePost,
	isPostExists,
};

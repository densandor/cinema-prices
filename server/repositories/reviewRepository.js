//imports the connection to the database
const db = require("../config/connector");

//creates a review with all details
const createReview = async (movie_id, user_id, title, content, score, date) => {
	//inserts the review into the database
	await db.query(
		"INSERT INTO reviews (movie_id, user_id, review_title, review_content, score, date) VALUES (?,?,?,?,?,?)",
		[movie_id, user_id, title, content, score, date]
	);
};

//gets all reviews for a movie
const getReviews = async (movie_id) => {
	//gets the review from the database using the movie's id
	const [reviews] = await db.execute(
		"SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE reviews.movie_id = ?",
		[movie_id]
	);
	//returns the reviews
	return Promise.resolve(reviews);
};

//updates a review with all details
const updateReview = async (movie_id, user_id, title, content, score, date) => {
	//updates the review in the database
	await db.query(
		"UPDATE reviews SET review_title = ?, review_content = ?, score = ?, date = ? WHERE user_id = ? AND movie_id = ?",
		[title, content, score, date, user_id, movie_id]
	);
};

//deletes a review based on user and movie ID
const deleteReview = async (movie_id, user_id) => {
	//deletes the review from the database
	await db.query("DELETE FROM reviews WHERE movie_id = ? AND user_id = ?", [
		movie_id,
		user_id,
	]);
};

//checks if a review is in the database by user and movie ID
const isReviewExists = async (movie_id, user_id) => {
	//gets the review from the database
	const [review] = await db.execute(
		"SELECT review_title FROM reviews WHERE user_id = ? AND movie_id = ? LIMIT 1;",
		[user_id, movie_id]
	);
	//checks if anything is returned
	if (review.length == 0) {
		//returns false if nothing is gotten
		return Promise.resolve(false);
	} else {
		//returns true otherwise
		return Promise.resolve(true);
	}
};

module.exports = {
	createReview,
	getReviews,
	updateReview,
	deleteReview,
	isReviewExists,
};

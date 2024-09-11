//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");
const reviewRepo = require("../repositories/reviewRepository");

//gets all reviews for a movie
const getReviews = async (req, res) => {
	//get the movie id from the request
	const movie_id = req.query.id;
	try {
		//gets an array of reviews from database
		const reviews = await reviewRepo.getReviews(movie_id);
		//returns the reviews to the frontend
		return res.status(200).json({ reviewsArr: reviews });
	} catch (err) {
		//returns an error
		return res.status(500).json({ message: err.message });
	}
};

//saves a new or existing review
const saveReview = async (req, res) => {
	//gets values from request
	const { movie_id, title, content, score, date } = req.body;
	//gets the user id of the currently logged in user
	const user_id = req.session.user.user_id;
	try {
		//checks if the movie with that id exists
		const existingMovie = await movieRepo.isMovieExists(movie_id);
		if (!existingMovie) {
			//return an error if the movie doesn't exist
			return res.status(400).json({
				message: "There is no movie with this id",
			});
		}
		//checks if the review already exists
		const existingReview = await reviewRepo.isReviewExists(movie_id, user_id);
		if (!existingReview) {
			//adds a new review to the
			await reviewRepo.createReview(
				movie_id,
				user_id,
				title,
				content,
				score,
				date
			);
			//returns success message
			console.log("Successfully added review");
			return res.status(200).json({ message: "Review created successfully" });
		} else {
			//updating an existing review in the database
			await reviewRepo.updateReview(
				movie_id,
				user_id,
				title,
				content,
				score,
				date
			);
			//returns success message
			return res.status(200).json({ message: "Review updated successfully" });
		}
	} catch (err) {
		//returns an error if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};

//deletes a review
const deleteReview = async (req, res) => {
	//gets movie id from the request
	const { movie_id } = req.body;
	//gets the user id of the currently signed in user
	const user_id = req.session.user.user_id;
	try {
		//checks if the review exists
		const existingReview = await reviewRepo.isReviewExists(movie_id, user_id);
		if (!existingReview) {
			//returns error message if no review is found
			return res.status(400).json({
				message: "This account has no review for this movie",
			});
		}
		//deletes the review from the database
		await reviewRepo.deleteReview(movie_id, user_id);
		//returns success message
		return res.status(200).json({ message: "Review deleted successfully" });
	} catch (err) {
		//returns error message if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { getReviews, saveReview, deleteReview };

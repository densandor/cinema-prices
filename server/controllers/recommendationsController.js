//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");

const handleRecommendations = async (req, res) => {
	try {
		//gets which page of the recommendations from the request
		const { pages } = req.query;
		//gets the genres of the signed in user
		const userGenres = req.session.user.genres;
		//gets the movie details from the database
		const foundMovies = await movieRepo.getRecommendations(userGenres, pages);
		//returns the movies to the frontend
		return res.status(200).json({ foundMovies });
	} catch (err) {
		//return an error
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { handleRecommendations };

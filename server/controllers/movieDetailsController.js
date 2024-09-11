//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");

const handleMovieDetails = async (req, res) => {
	//gets the movie id from the request
	const id = req.query.id;
	try {
		//gets the details from the database
		const foundMovie = await movieRepo.getMovieDetails(id);
		//gets the showtimes of the movie from the database
		const showtimes = await movieRepo.getShowtimes(id);
		//returns the details and the showtimes successfully
		return res.status(200).json({ movie: foundMovie, showtimes: showtimes });
	} catch (err) {
		//returns an error if the details could not be retrieved
		return res.status(500).json({ message: err.message });
	}
};
module.exports = { handleMovieDetails };

//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");

const handleGetLatestMovies = async (req, res) => {
	try {
		//gets the array of movies which are most recently released
		const foundMovies = await movieRepo.searchMovie(
			"",
			"release_date",
			"DESC",
			0
		);
		//returns the array of movies successfully
		return res.status(200).json({ foundMovies });
	} catch (err) {
		//returns an error if the movies couldn't be retrieved
		return res.status(500).json({ message: err.message });
	}
};
module.exports = { handleGetLatestMovies };

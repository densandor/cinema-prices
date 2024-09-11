//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");

const handleSearch = async (req, res) => {
	//gets the search values from the request
	const { queryItem, sortBy, pages } = req.query;
	//splits up the sort by into the column and the order
	const sortArr = sortBy.split(" ");
	try {
		//gets array of movies which match the query
		const foundMovies = await movieRepo.searchMovie(
			queryItem,
			sortArr[0],
			sortArr[1],
			pages
		);
		//returns the array of movies
		return res.status(200).json({ foundMovies });
	} catch (err) {
		//returns an error if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};
module.exports = { handleSearch };

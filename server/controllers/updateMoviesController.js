//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");
const config = require("../config/config");

const Axios = require("axios");

const handleGetNewMovies = async (req, res) => {
	//gets the date of the latest movie in the database
	let startDate = await movieRepo.getNewestMovieDate();
	//converts the date to a string
	startDate = startDate.toISOString().slice(0, -14);
	//gets the current date as a string
	let endDate = new Date().toISOString().slice(0, -14);
	try {
		let count = 0;
		let page = 1;
		let popularity = 300;
		let response;
		let movies;
		let movie;
		let movieIds = [];
		//getting every movie with a popularity above 300
		while (popularity >= 300) {
			//checks whether page needs to be increased
			if (count % 20 == 0) {
				//gets a new page of movie results from the API
				response = await Axios.get(
					"https://api.themoviedb.org/3/discover/movie?api_key=" +
						config.key +
						"&language=en-US&page=" +
						page +
						"&primary_release_date.gte=" +
						startDate +
						"&primary_release_date.lte=" +
						endDate
				);
				//increments the page to get
				page = page + 1;
				//resets the count to the start of the page
				count = 0;
			}
			//gets the list of the results from API response
			movies = response.data.results;
			//gets the current movie
			movie = movies[count];
			//checks the popularity
			popularity = movie.popularity;
			//checks if the movie is already in the database
			if (!(await movieRepo.isMovieExists(movie.id))) {
				movieIds.push(movie.id);
			}
			//increments the count to the next movie
			count = count + 1;
		}

		//iterates through the list of movie IDs
		for (let i = 0; i < movieIds.length; i++) {
			//gets the details of each one from the dataase
			let details = await Axios.get(
				"https://api.themoviedb.org/3/movie/" +
					movieIds[i] +
					"?api_key=f24e195ff96735a54d90ac08f5bfa7cb&language=en-US"
			);
			//gets the data from the API response
			details = details.data;
			//gets a list of the genre IDs for the movie
			const genreList = details.genres.map((obj) => {
				return obj.id;
			});
			//adds the new movie to the database
			const addedMovie = await movieRepo.addMovie(
				details.id,
				details.title,
				details.runtime,
				details.release_date,
				details.overview,
				details.budget,
				details.revenue,
				details.poster_path,
				genreList
			);
		}
		//returns success message
		return res.status(200).json({ message: "new movies added" });
	} catch (err) {
		//returns an error if something goes wrong
		return res.status(500).json({ message: err.message });
	}
};
module.exports = { handleGetNewMovies };

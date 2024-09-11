//imports the connection to the database
const db = require("../config/connector");

//imports the cache class to be able to create caches
const { Cache } = require("../cache/cache");

//imports the functions which are used to access the database
const cinemaRepo = require("./cinemaRepository");

//Genres

//sets the cache to last 1 hour
const ttl = 60 * 60 * 1;
//create a new instance of a cache for genres
const genreCache = new Cache(ttl);

//function to retrieve all genres from database (used by the cache)
const getFromDB = async () => {
	//gets all the genres from the database
	const [results] = await db.execute("SELECT * FROM genres");
	//returns the genres
	return Promise.resolve(results);
};

//gets all possible genres from cache
const getAllGenres = () => {
	//gets all genres from the cache
	const genreArr = genreCache.get("allgenres", getFromDB);
	//retruns the genres
	return Promise.resolve(genreArr);
};

//Movies

//gets a movie's details by ID
const getMovieDetails = async (movie_id) => {
	//retrieves the movies details from the database
	const [movie] = await db.execute(
		"SELECT m.*, GROUP_CONCAT(DISTINCT g.genre_id) AS genres FROM movies m INNER JOIN movie_genres g ON g.movie_id = m.movie_id WHERE m.movie_id = ? GROUP BY m.movie_id;",
		[movie_id]
	);
	//gets the data from the response
	movieData = movie[0];
	// this needs to be done as the rating is returned as a string from MySQL
	movieData.rating = parseFloat(movieData.rating);
	//splits the genres from the response into the individual genre IDs
	movieData.genres = movieData.genres.split(",");
	//converts all the genre ids into numbers
	movieData.genres = movieData.genres.map((id) => {
		return Number(id);
	});
	//returns the movie data
	return Promise.resolve(movieData);
};

//gets showtimes for a movie by id
const getShowtimes = async (movie_id) => {
	//retrieves the showtimes from the database
	const [showtimes] = await db.execute(
		"SELECT s.*, c.cinema_name AS cinema FROM showings s INNER JOIN cinemas c ON c.cinema_id = s.cinema_id WHERE movie_id = ? AND show_date >= CURRENT_TIMESTAMP ORDER BY show_date, cinema_id",
		[movie_id]
	);

	let showtimesByDate = {};
	//iterates through the showtime
	for (let i = 0; i < showtimes.length; i++) {
		//gets the current show
		let showing = showtimes[i];
		//gets the date of the current showing
		let date = String(showing.show_date).slice(0, 10);
		//checks if the results contain the date
		if (!showtimesByDate[date]) {
			//add a new array to results with the new date
			showtimesByDate[date] = [];
		}
		//adds the showing to the correct array of results
		showtimesByDate[date].push(showing);
	}
	//returns the results
	return Promise.resolve(showtimesByDate);
};

//adds a new showtime to the database
const insertShowtime = async (
	movie_name,
	cinema_name,
	show_date,
	price,
	link
) => {
	//gets the id of the movie based on the name
	const [idresults] = await db.execute(
		"SELECT movie_id FROM movies WHERE title = ?",
		[movie_name]
	);
	if (idresults.length == 0) {
		return Promise.reject("This movie doesn't exist");
	}
	const movie_id = idresults[0].movie_id;
	//checks whether the cinema is already in the database
	const existingCinema = await cinemaRepo.isCinemaExists(cinema_name);
	if (!existingCinema) {
		//adds a new cinema to the database if it doesn't exist
		await cinemaRepo.addCinema(cinema_name);
	}
	//gets the id of the cinema
	const cinema_id = await cinemaRepo.searchCinemas(cinema_name);
	//checks if the showtime is already in the database
	const existingShowing = await cinemaRepo.isShowingsExists(
		movie_id,
		show_date,
		cinema_id
	);
	if (!existingShowing) {
		//adds the showing to the database if its not
		await db.execute(
			"INSERT INTO showings (movie_id, show_date, price, cinema_id, link) VALUES (?,?,?,?,?)",
			[movie_id, show_date, price, cinema_id, link]
		);
		//returns success message
		return Promise.resolve("Added showtime");
	} else {
		//returns error message if the showtime already exists
		return Promise.resolve("This showtime already exists");
	}
};

//function to add a new movie to the database
const addMovie = async (
	movie_id,
	title,
	runtime,
	release_date,
	overview,
	budget,
	revenue,
	poster_path,
	genreList
) => {
	//adds the movie to the database
	await db.execute(
		"INSERT INTO movies (movie_id, title, runtime, release_date, overview, budget, revenue, poster_path) VALUES (?,?,?,?,?,?,?,?);",
		[
			movie_id,
			title,
			runtime,
			release_date,
			overview,
			budget,
			revenue,
			poster_path,
		]
	);
	//checks if the genre list has values
	if (genreList.length > 0) {
		//converts the genreList into sublists, each with the movie id and the genre id
		genreList = genreList.map((id) => {
			return [movie_id, id];
		});
		//adds each of the genres into the database
		await db.query("INSERT INTO movie_genres (movie_id, genre_id) VALUES ?;", [
			genreList,
		]);
	}
	//returns success message
	return Promise.resolve("added movie");
};

//function to get the release date of the latest movie in the database
const getNewestMovieDate = async () => {
	//gets the release date from the database
	const [result] = await db.execute(
		"SELECT release_date FROM movies ORDER BY release_date DESC LIMIT 1;"
	);
	date = result[0].release_date;
	//returns the date
	return Promise.resolve(date);
};

//function to get recommendations from the database
const getRecommendations = async (genreIds, pages) => {
	//gets the recommendations
	const [movies] = await db.query(
		"SELECT * FROM movies WHERE movie_id IN (SELECT movie_id FROM movie_genres WHERE movie_genres.genre_id IN (?) ) ORDER BY release_date DESC , rating DESC LIMIT ?, 10;",
		[genreIds, pages * 10]
	);
	//returns them
	return Promise.resolve(movies);
};

//function to search for a movie
const searchMovie = async (query, sortBy, order, page) => {
	try {
		//searches for the movie, 10 at a time
		const [movieResults] = await db.query(
			"SELECT * FROM movies WHERE title LIKE ? ORDER BY " +
				db.escapeId(sortBy) +
				(order == "DESC" ? " DESC " : " ") +
				"LIMIT ? , 10;",
			["%" + query + "%", page * 10]
		);
		//returns the results
		return Promise.resolve(movieResults);
	} catch (error) {
		console.log(error);
	}
};

//checks if a movie is in the database by ID
const isMovieExists = async (movie_id) => {
	//gets the movie of the database using a movie id
	const [movie] = await db.execute(
		"SELECT title FROM movies WHERE movie_id = ? LIMIT 1;",
		[movie_id]
	);
	//checks if any movie is found
	if (movie.length == 0) {
		//returns false if no movie is found
		return Promise.resolve(false);
	} else {
		//returns true otherwise
		return Promise.resolve(true);
	}
};

module.exports = {
	getAllGenres,
	getMovieDetails,
	getShowtimes,
	insertShowtime,
	getNewestMovieDate,
	addMovie,
	getRecommendations,
	searchMovie,
	isMovieExists,
};

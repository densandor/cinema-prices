//imports the connection to the database
const db = require("../config/connector");

//checks if a cinema with a certain name is already in the database
const isCinemaExists = async (name) => {
	//gets the cinema from the database
	const [cinema] = await db.execute(
		"SELECT cinema_id FROM cinemas WHERE cinema_name = ? LIMIT 1;",
		[name]
	);
	//checks whether anything is returned
	if (cinema.length == 0) {
		//returns false if nothing is found
		return Promise.resolve(false);
	} else {
		//returns true if the cinema exists in the database
		return Promise.resolve(true);
	}
};

//search for a cinema by name
const searchCinemas = async (name) => {
	try {
		//gets the cinema id from the database based on name
		const [cinemas] = await db.execute(
			"SELECT cinema_id FROM cinemas WHERE cinema_name = ? LIMIT 1;",
			[name]
		);
		//returns the id of the cinema
		return Promise.resolve(cinemas[0].cinema_id);
	} catch (error) {
		console.log(error);
	}
};

//adds a new cinema into the database
const addCinema = async (name) => {
	await db.execute("INSERT INTO cinemas (cinema_name) VALUES (?)", [name]);
};

//checks if a showing is in the database
const isShowingsExists = async (movie_id, showing_time, cinema_id) => {
	//gets the showings based on time, movie id and cinema id
	const [showings] = await db.execute(
		"SELECT showing_id FROM showings WHERE movie_id = ? AND show_date = ? AND cinema_id = ? LIMIT 1;",
		[movie_id, showing_time, cinema_id]
	);
	//checks if any showings were found
	if (showings.length == 0) {
		//returns false if none were found
		return Promise.resolve(false);
	} else {
		//returns true if it was found
		return Promise.resolve(true);
	}
};

module.exports = { isCinemaExists, searchCinemas, addCinema, isShowingsExists };

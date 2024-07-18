//imports the connection to the database
const db = require("../config/connector");

//sreates new user
const createUser = async (
	username,
	hashedPassword,
	email,
	firstname,
	lastname
) => {
	//adds a new user to the database
	await db.query(
		"INSERT INTO users (username, password, email, firstname, lastname) VALUES (?,?,?,?,?)",
		[username, hashedPassword, email, firstname, lastname]
	);
};

//gets user details by username
const getUser = async (username) => {
	//gets the user from the database using username
	const [user] = await db.execute(
		"SELECT u.*, GROUP_CONCAT(DISTINCT p.genre_id) AS genres FROM users u LEFT JOIN user_genres p ON p.user_id = u.user_id WHERE u.username = ? GROUP BY u.user_id;",
		[username]
	);
	userData = user[0];
	//checks if the user has any genre preferences set
	if (userData.genres) {
		//splits the genres found into the separate ids
		userData.genres = userData.genres.split(",");
		//converts the genres into numbers
		userData.genres = userData.genres.map((id) => {
			return Number(id);
		});
	} else {
		//returns an empty array for the genres
		userData.genres = [];
	}
	//returns the user's details
	return Promise.resolve(userData);
};

//updates user details
const updateUser = async (user_id, username, firstname, lastname, email) => {
	//updates the details of the user in the database
	await db.query(
		"UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ? WHERE user_id = ?",
		[username, firstname, lastname, email, user_id]
	);
};

//changes password
const updatePassword = async (user_id, newPassword) => {
	//changes the password hash in the database
	await db.query("UPDATE users SET password = ? WHERE user_id = ?", [
		newPassword,
		user_id,
	]);
};

//checks if a user with a certain username is already in the database
const isUserExists = async (username) => {
	//gets the user from the database
	const [user] = await db.execute(
		"SELECT user_id FROM users WHERE username = ? LIMIT 1;",
		[username]
	);
	//checks if anything was found
	if (user.length == 0) {
		//returns false if nothing was found
		return Promise.resolve(false);
	} else {
		//returns true otherwise
		return Promise.resolve(true);
	}
};

//adds a genre for a user
const insertUserGenre = async (user_id, genre_id) => {
	//inserts a new user id and genre id pair into the database
	await db.query("INSERT INTO user_genres (user_id, genre_id) VALUES (?,?)", [
		user_id,
		genre_id,
	]);
};

//deletes all genres of a user
const deleteUserGenres = async (user_id) => {
	//removes all the genre preferences for a certain user id
	await db.query("DELETE FROM user_genres WHERE user_id = ?", [user_id]);
};

module.exports = {
	createUser,
	getUser,
	updateUser,
	updatePassword,
	isUserExists,
	insertUserGenre,
	deleteUserGenres,
};

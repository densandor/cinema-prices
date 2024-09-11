//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");
const userRepo = require("../repositories/userRepository");

const handleGetGenres = async (req, res) => {
	try {
		//Getting all genres from database
		const genres = await movieRepo.getAllGenres();
		//returning them to the user
		return res.status(200).json({ genres });
	} catch (err) {
		//return an error message if the genres couldn't be retrieved
		return res.status(500).json({ message: err.message });
	}
};

const handleUpdateUserGenres = async (req, res) => {
	try {
		//get the new genre array from the request
		const { genres } = req.body;
		//get the id of the currently logged in user
		const user_id = req.session.user.user_id;
		//check if the new genres contain values
		if (genres.length > 0) {
			//delete all the existing genres for the user
			await userRepo.deleteUserGenres(user_id);
			//adding each of the new genres
			genres.forEach(async (element) => {
				await userRepo.insertUserGenre(user_id, element);
			});
			//sets the logged in user to have the updated genres
			req.session.user.genres = genres;
			//return success
			return res.status(200).json({ message: "Genres update sucessfully" });
		} else {
			//return error message if the genres are missing
			return res.status(400).json({ message: "Missing genres" });
		}
	} catch (err) {
		//return an error message
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { handleGetGenres, handleUpdateUserGenres };

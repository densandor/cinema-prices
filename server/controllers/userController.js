//imports the functions which are used to access the database
const userRepo = require("../repositories/userRepository");

const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
	//gets the values from the request
	const { username, firstname, lastname, email, password } = req.body;

	//checks if the user already exists
	const existingUser = await userRepo.isUserExists(username);
	if (existingUser) {
		//sendd error message
		return res
			.status(409)
			.json({ message: "Account already exists with the same username" });
	}
	try {
		//hashes the password
		const hashedPassword = await bcrypt.hash(password, 10);
		//adds the user into the database
		await userRepo.createUser(
			username,
			hashedPassword,
			email,
			firstname,
			lastname
		);
		//sends success message
		return res.status(200).json({
			message: "successfully created user" + username,
		});
	} catch (err) {
		//sends an error message if something went wrong
		return res.status(500).json({ message: err.message });
	}
};

const updateUser = async (req, res) => {
	//gets the values from the request
	const { username, firstname, lastname, email } = req.body;
	//checks if the username has been changed
	if (req.session.user.username != username) {
		//checks to see if the new username is taken
		const existingUser = await userRepo.isUserExists(username);
		if (existingUser) {
			//sending error message
			return res
				.status(409)
				.json({ message: "Account already exists with the same username" });
		}
	}
	try {
		//gets the id of the logged in user
		const user_id = req.session.user.user_id;
		//updates the existing details
		await userRepo.updateUser(user_id, username, firstname, lastname, email);
		//sends successful response
		return res.status(200).json({ message: "User updated successfully" });
	} catch (err) {
		//returns an error message if something went wrong
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { createUser, updateUser };

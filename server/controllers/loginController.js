const bcrypt = require("bcrypt");
const config = require("../config/config");

//imports the functions which are used to access the database
const userRepo = require("../repositories/userRepository");

const handleLogin = async (req, res) => {
	//gets the login values from the request
	const { username, password } = req.body;
	try {
		//checks if the user exists with that username
		const existingUser = await userRepo.isUserExists(username);
		if (!existingUser) {
			//return error message if the user doesnt exist
			return res.status(401).json({ message: "Unauthorized" });
		}
		//otherwise get the details of the user
		const foundUser = await userRepo.getUser(username);
		//check if the passwords match
		const match = await bcrypt.compare(password, foundUser.password);
		if (match) {
			//sets the logged in user to be the user from the database
			req.session.user = { ...foundUser };
			//assigns roles to the logged in user based on username
			if (config.admins.includes(foundUser.username)) {
				req.session.user.role = "admin";
			} else {
				req.session.user.role = "user";
			}
			foundUser.role = req.session.user.role;

			//removing password so it's not sent to the frontend
			delete foundUser.password;
			//returning success message and user details to the frontend
			return res.status(200).json({ user: foundUser });
		} else {
			//returning error message if the passwords don't match
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (err) {
		//returning error message if something else went wrong
		return res.status(500).json({ message: err });
	}
};

const handlePasswordChange = async (req, res) => {
	//get the old and new password from the request
	const { password, newPassword } = req.body;
	try {
		//check if the old passwords match
		const match = await bcrypt.compare(password, req.session.user.password);
		if (match) {
			//hashing the new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			//update the password in the database
			await userRepo.updatePassword(req.session.user.user_id, hashedPassword);
			//updating the password of the currently logged in user
			req.session.user.password = hashedPassword;
			//return success message
			return res.status(200).json({ message: "Updated password" });
		} else {
			//return error if the passwords don't match
			return res.status(401).json({ message: "Unauthorized" });
		}
	} catch (err) {
		//returning an error message if something else went wrong
		return res.status(500).json({ message: err });
	}
};

module.exports = { handleLogin, handlePasswordChange };

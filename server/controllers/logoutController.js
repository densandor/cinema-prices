const handleLogout = async (req, res) => {
	//removes the existing user from the session
	req.session.destroy((err) => {
		//checks for any error
		if (err) throw err;
		//removes the cookie so they don't stay logged in on the frontend
		res.clearCookie("userID", { sameSite: "strict" });
		//returns success
		res.status(200).json({ message: "OK" });
	});
};

module.exports = { handleLogout };

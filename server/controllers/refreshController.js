const handleRefresh = async (req, res) => {
	//checks if there is a user currently logged in
	if (req.session.user) {
		//copies the currenly signed in user's details
		const userDetails = structuredClone(req.session.user);
		//removes password hash so its not sent to the user
		delete userDetails.password;
		//sends a response with the deatils of the current user
		res.send({ loggedIn: true, user: userDetails });
	} else {
		//sends a response without the user
		res.send({ loggedIn: false });
	}
};

module.exports = { handleRefresh };

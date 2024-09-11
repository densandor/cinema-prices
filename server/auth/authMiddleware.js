function authRoles(allowedRoles) {
	//function takes an array of the possible allowed roles to access an endpoint
	return async (req, res, next) => {
		//gets the role of the currently signed in user
		const userRole = req.session?.user?.role;
		//checks if the role is part of allowed roles
		if (userRole && allowedRoles.includes(userRole)) {
			//moves forward with the request
			next();
		} else {
			//returns an unauthorised error as the response
			return res.status(403).json({
				message:
					"Unauthorized - you don't have permission to access this endpoint",
			});
		}
	};
}

module.exports = authRoles;

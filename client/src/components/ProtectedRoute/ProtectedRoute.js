import { useContext } from "react";
//imports navigation features from the site navigation library
import { Navigate, useLocation } from "react-router-dom";
//imports the context to be able to access user details
import UserContext from "../../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
	//gets the user details from the site context
	const { user } = useContext(UserContext);
	//gets the current address of the page the user is visiting from
	const location = useLocation();
	//checks if the user roles matches the roles allowed for the page
	if (allowedRoles.includes(user?.role)) {
		//if so, returns the nested pages
		return children;
	} else if (user.user_id) {
		//if the user is logged in, send them to unauthorized page
		return <Navigate to="/unauthorized" state={{ from: location }} replace />;
	} else {
		//otherwise send them to sign in
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
};

export default ProtectedRoute;

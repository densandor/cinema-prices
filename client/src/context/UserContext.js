import { createContext, useState } from "react";

//creates a new instance of a context
const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	//presets the user and to be an empty object
	const [user, setUser] = useState({});
	//returns a wrapper where the user object is accessible in all of the children compontents
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;

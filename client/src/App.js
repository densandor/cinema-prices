import React, { useContext, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Axios from "axios";

//imports the context to be able to access user details
import UserContext from "./context/UserContext";
//imports user class to be able to create an instance of it for the context
import User from "./components/Auth/userClass";
//imports reusable protected route component
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

//imports the components and pages to be displayed
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Search from "./pages/search";
import MoviePage from "./pages/moviePage";
import Profile from "./pages/profile";
import Recommendations from "./pages/recommendations";
import Admin from "./pages/admin";

function App() {
	//sets the requests to be sent with the cookie by default
	Axios.defaults.withCredentials = true;
	//useRef is here because it needs the INTIAL value from the context which is kept by ref
	const userSetter = useRef(useContext(UserContext));

	// function is called whenever the site is reloaded (on any page)
	useEffect(() => {
		//function checks if user is logged in on page refresh
		const getSessionUser = async () => {
			//sends a request to the backend
			const response = await Axios.get("http://localhost:3001/refresh");
			if (response.data.loggedIn === true) {
				console.log("Currently logged in user: ", response.data);
				//if there is a user, creates a new user object
				const currentUser = new User(...Object.values(response.data.user));
				//adds the user object to context
				userSetter.current.setUser(currentUser);
			}
		};
		getSessionUser();
	}, []);

	return (
		<div className="page-container">
			<Router>
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/register" element={<Register />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/search" element={<Search />} />
					<Route
						exact
						path="/profile"
						element={
							<ProtectedRoute allowedRoles={["user", "admin"]}>
								<Profile />
							</ProtectedRoute>
						}
					/>
					<Route
						exact
						path="/recommendations"
						element={
							<ProtectedRoute allowedRoles={["user", "admin"]}>
								<Recommendations />
							</ProtectedRoute>
						}
					/>
					<Route path="/movie/:id" element={<MoviePage />} />
					<Route
						exact
						path="/admin"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<Admin />
							</ProtectedRoute>
						}
					/>
					<Route path="/unauthorized" element={"Unauthorized"} />
					<Route path="*" element={"404 Page Not Found"} />
				</Routes>
				<div className="footer">
					<Footer />
				</div>
			</Router>
		</div>
	);
}

export default App;

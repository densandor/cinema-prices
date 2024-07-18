import "../pages.css";
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
//imports components from the site navigation library
import { Link, useLocation, useNavigate } from "react-router-dom";
//imports the reusable form input component
import FormInput from "../components/FormInput/FormInput";
//imports components from the UI library
import { Divider, Text, Flex } from "@chakra-ui/react";

//imports the context to be able to access user details
import UserContext from "../context/UserContext";
//imports the user class to be able to create a new instance
import User from "../components/Auth/userClass";

function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	//gets where the user came from
	const from = location.state?.from?.pathname || "/";

	//presets the input values to be empty
	const [loginValues, setLoginValues] = useState({
		username: "",
		password: "",
	});

	//presets the response status which can be displayed
	const [loginStatus, setLoginStatus] = useState("");
	//gets the user details from the context
	const { user, setUser } = useContext(UserContext);

	Axios.defaults.withCredentials = true;

	const login = async (event) => {
		//stops the page from reloading
		event.preventDefault();
		try {
			//sends request with the username and password
			const response = await Axios.post("http://localhost:3001/login", {
				username: loginValues["username"],
				password: loginValues["password"],
			});
			//creates a new user object from the response
			const currentUser = new User(...Object.values(response.data.user));
			//adds the user to context
			setUser(currentUser);
			//sets the success message on the page
			setLoginStatus("Logged in as " + currentUser.username);
		} catch (err) {
			//Handling error codes
			if (!err?.response) {
				setLoginStatus("No server response");
			} else if (err.response?.status === 400) {
				setLoginStatus("Missing username or password");
			} else if (err.response?.status === 401) {
				setLoginStatus("Incorrect username or password");
			} else {
				setLoginStatus("Login failed");
			}
		}
	};

	//function called when the user id changes
	useEffect(() => {
		console.log(user.role);
		//if a user id is present
		if (user.user_id) {
			if (user.role == "admin") {
				navigate("/admin", { replace: true });
			} else {
				//the user is navigated to where they came from or the home page
				navigate(from, { replace: true });
			}
		}
	}, [user?.user_id]);

	//changes the input values
	const changeValues = (e) => {
		//updates the state at the position of the input to the value of the input
		setLoginValues({
			...loginValues,
			[e.target.name]: e.target.value,
		});
	};

	//presets the properties of the inputs which are passed to the form input components
	const inputs = [
		{
			id: 1,
			name: "username",
			type: "text",
			placeholder: "Username",
			errorMessage: "A username is required without special characters",
			label: "Username",
			pattern: `^[A-Za-z0-9]*$`,
			required: true,
		},
		{
			id: 2,
			name: "password",
			type: "password",
			placeholder: "Password",
			errorMessage: "Missing password",
			label: "Password",
			required: true,
		},
	];

	return (
		<div className="content">
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>Login</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			<form className="form" id="login" onSubmit={login}>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={loginValues[input.name]}
						onChange={changeValues}
					/>
				))}
				<h3 className="errorMessage">{loginStatus}</h3>
				<button className="form-button">Login</button>
				<Link className="redirectLink" to="/register">
					Don't have an account? Sign up here
				</Link>
			</form>
		</div>
	);
}

export default Login;

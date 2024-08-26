import React, { useState } from "react";
//imports links from site navigation library
import { Link } from "react-router-dom";
import Axios from "axios";
//imports components from the UI library
import { Divider, Text, Flex } from "@chakra-ui/react";
//imports the reusable forminput component
import FormInput from "../components/FormInput/FormInput";
//uses the reusable css file
import "../pages.css";

function Register() {
	//presets the registation inputs to be empty values
	const [regValues, setRegValues] = useState({
		username: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	//presets the response message which can be displayed
	const [regStatus, setRegStatus] = useState("");

	//function called when the registation starts
	const register = async (event) => {
		//stops the page from reloading
		event.preventDefault();
		try {
			//sends a request to the API to create a new use with the details
			await Axios.post("http://localhost:3001/user", {
				username: regValues["username"],
				firstname: regValues["firstname"],
				lastname: regValues["lastname"],
				email: regValues["email"],
				password: regValues["password"],
				confirmPassword: regValues["confirmPassword"],
			});
			//sets the success message
			setRegStatus("Successfully registered");
		} catch (err) {
			//handling error codes
			if (!err?.response) {
				setRegStatus("No Server Response");
			} else if (err.response?.status === 400) {
				setRegStatus("Missing username or password");
			} else if (err.response?.status === 409) {
				setRegStatus("Username Taken");
			} else {
				setRegStatus("Registration Failed");
			}
		}
	};

	//updates the input values
	const handleChange = (e) => {
		//changes the input values at the name of the input to the value of it
		setRegValues({ ...regValues, [e.target.name]: e.target.value });
	};

	//sets the properties of the inputes to be passed to the form input components
	const inputs = [
		{
			id: 1,
			name: "username",
			type: "text",
			placeholder: "Username",
			errorMessage: "Username must only be letters or numbers, 3-20 characters",
			label: "Username",
			pattern: "^[A-Za-z0-9]{3,20}$",
			required: true,
		},
		{
			id: 2,
			name: "firstname",
			type: "text",
			placeholder: "First name",
			errorMessage: "Name must only be letters, 2-20 characters",
			label: "First name",
			pattern: "^[A-Za-z]{2,20}$",
			required: true,
		},
		{
			id: 3,
			name: "lastname",
			type: "text",
			placeholder: "Last name",
			errorMessage: "Name must only be letters, 2-20 characters",
			label: "Last name",
			pattern: "^[A-Za-z]{2,20}$",
			required: true,
		},
		{
			id: 4,
			name: "email",
			type: "email",
			placeholder: "Email",
			errorMessage: "Not a valid email address",
			label: "Email",
			required: true,
		},
		{
			id: 5,
			name: "password",
			type: "password",
			placeholder: "Password",
			errorMessage:
				"Password must have a lower and uppercase letter, number and special character, 8-20 characters",
			label: "Password",
			pattern:
				"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!\\@\\#\\$\\%\\^\\&\\*\\,\\.\\;\\:\\~\\|])[a-zA-Z0-9!\\@\\#\\$\\%\\^\\&\\*\\,\\.\\;\\:\\~\\|]{8,20}$",
			required: true,
		},
		{
			id: 6,
			name: "confirmPassword",
			type: "password",
			placeholder: "Confirm Password",
			errorMessage: "Passwords must match",
			label: "Confirm Password",
			pattern: regValues.password,
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
				<Text padding={2}>Register</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			<form className="form" id="register" onSubmit={register}>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={regValues[input.name]}
						onChange={handleChange}
					/>
				))}
				<h3>{regStatus}</h3>
				<button>Create account</button>
				<Link className="redirectLink" to="/login">
					Already have an account? Log in here
				</Link>
			</form>
		</div>
	);
}

export default Register;

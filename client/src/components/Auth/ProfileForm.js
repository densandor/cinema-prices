import React, { useState, useContext } from "react";

//imports the reusable form input component
import FormInput from "../FormInput/FormInput";
//imports the context to be able to access user details
import UserContext from "../../context/UserContext";

function ProfileForm() {
	//gets the user's existing details from the session
	const { user } = useContext(UserContext);

	//presents the response messages that can be displayed
	const [userStatus, setUserStatus] = useState("");
	const [passwordStatus, setPasswordStatus] = useState("");
	//presets the existing values for the form
	const [userValues, setUserValues] = useState({
		username: user.username,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
	});
	const [passwordValues, setPasswordValues] = useState({
		password: "",
		newPassword: "",
	});

	//changes the input values state at the name of the input to its value
	const handleChange = (e) => {
		//prevents page from reloading
		e.preventDefault();
		//sets the user values to the previous values as well as the new field and its value
		setUserValues({ ...userValues, [e.target.name]: e.target.value });
	};

	//changes the password input values
	const handlePasswordChange = (e) => {
		//prevents page from reloading
		e.preventDefault();
		//sets the password values to the previous values as well as the new field and its value
		setPasswordValues({ ...passwordValues, [e.target.name]: e.target.value });
	};

	//function to save the user details to the backend
	const submit = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//calls the saveDetails method from the userclass using the new values
			await user.saveDetails(userValues);
			//sets the response message
			setUserStatus("Details successfully updated");
		} catch (err) {
			//sets the response message to an error message
			setUserStatus(err);
		}
	};

	//function to save the password
	const submitPassword = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//calls the updatePassword method from the user class
			await user.updatePassword(passwordValues);
			//sets the response message
			setPasswordStatus("Password successfully updated");
		} catch (err) {
			//sets the error message to be displayed
			setPasswordStatus(err);
		}
	};

	//presents the properties of the inputs in the user details form
	const inputs = [
		{
			id: 0,
			name: "username",
			type: "text",
			placeholder: "Enter new username",
			errorMessage: "Username must only be letters or numbers, 3-20 characters",
			label: "New Username",
			pattern: "^[A-Za-z0-9]{3,20}$",
			required: true,
		},
		{
			id: 1,
			name: "firstname",
			type: "text",
			placeholder: "Enter new first name",
			errorMessage: "Name must only be letters, 2-20 characters",
			label: "New first name",
			pattern: "^[A-Za-z]{2,20}$",
			required: true,
		},
		{
			id: 2,
			name: "lastname",
			type: "text",
			placeholder: "Last name",
			errorMessage: "Name must only be letters, 2-20 characters",
			label: "Last name",
			pattern: "^[A-Za-z]{2,20}$",
			required: true,
		},
		{
			id: 3,
			name: "email",
			type: "email",
			placeholder: "Enter new email",
			errorMessage: "Not a valid email address",
			label: "New Email",
			required: true,
		},
	];

	//presents the properties of the inputs in password change form
	const passwordInputs = [
		{
			id: 0,
			name: "password",
			type: "password",
			placeholder: "Enter old password",
			errorMessage: "Old password is required",
			label: "Old password",
			required: true,
		},
		{
			id: 1,
			name: "newPassword",
			type: "password",
			placeholder: "Enter new password",
			errorMessage:
				"Password must have a lower and uppercase letter, number and special character, 8-20 characters",
			label: "New Password",
			pattern: `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
			required: true,
		},
	];

	return (
		<>
			<form className="plain-form" onSubmit={submit}>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={userValues[input.name]}
						onChange={handleChange}
					/>
				))}

				<h3>{userStatus}</h3>
				<button>Submit</button>
			</form>
			<form className="plain-form" onSubmit={submitPassword}>
				{passwordInputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={passwordValues[input.name]}
						onChange={handlePasswordChange}
					/>
				))}

				<h3>{passwordStatus}</h3>
				<button>Change password</button>
			</form>
		</>
	);
}

export default ProfileForm;

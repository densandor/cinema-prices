import Axios from "axios";

class User {
	//private attributes
	#user_id;
	#username;
	#email;
	#firstname;
	#lastname;
	#genres;
	#role;
	constructor(id, name, fname, lname, mail, genreList, role) {
		this.#user_id = id;
		this.#username = name;
		this.#email = mail;
		this.#firstname = fname;
		this.#lastname = lname;
		this.#genres = genreList;
		this.#role = role;
	}

	//public getters and setters for the user's details
	get user_id() {
		return this.#user_id;
	}
	get username() {
		return this.#username;
	}
	set username(newUsername) {
		this.#username = newUsername;
	}
	get email() {
		return this.#email;
	}
	set email(newEmail) {
		this.#email = newEmail;
	}
	get firstname() {
		return this.#firstname;
	}
	set firstname(newFirstname) {
		this.#firstname = newFirstname;
	}
	get lastname() {
		return this.#lastname;
	}
	set lastname(newLastname) {
		this.#lastname = newLastname;
	}
	//getter function to display the full name of the user
	get fullname() {
		return this.#firstname + " " + this.#lastname;
	}

	get genres() {
		return this.#genres;
	}
	set genres(newGenres) {
		this.#genres = newGenres;
	}

	get role() {
		return this.#role;
	}
	//public method to save the details of the user to the backend
	async saveDetails(newDetails) {
		try {
			//sends a request to the backend to update the user
			const response = await Axios.patch("http://localhost:3001/user", {
				username: newDetails.username,
				firstname: newDetails.firstname,
				lastname: newDetails.lastname,
				email: newDetails.email,
			});
			//sets the user in the context of the site if the request was successful
			if (response.status === 200) {
				this.username = newDetails.username;
				this.firstname = newDetails.firstname;
				this.lastname = newDetails.lastname;
				this.email = newDetails.email;
			}
			//returns success message
			return { message: "Updated details" };
		} catch (err) {
			//Handling error codes
			if (!err?.response) {
				return Promise.reject("No server response");
			} else if (err.response?.status === 400) {
				return Promise.reject("Missing details");
			} else if (err.response?.status === 401) {
				return Promise.reject("Unauthorized");
			} else if (err.response?.status === 409) {
				return Promise.reject("Username is taken");
			} else {
				return Promise.reject("Setting details failed");
			}
		}
	}

	//public method to update the user's genres
	async saveGenres() {
		try {
			//sends a request to the backend to save the user's genres
			await Axios.post("http://localhost:3001/genres", {
				genres: this.#genres,
			});
		} catch (err) {
			//Handling error codes
			if (!err?.response) {
				return Promise.reject("No server response");
			} else if (err.response?.status === 400) {
				return Promise.reject("Missing gernes");
			} else if (err.response?.status === 401) {
				return Promise.reject("Unauthorized");
			} else {
				return Promise.reject("Changing genres failed");
			}
		}
	}

	//public method to change the user's password
	async updatePassword({ password, newPassword }) {
		try {
			//sends a request to the backend to update the password
			const response = await Axios.patch("http://localhost:3001/login", {
				password: password,
				newPassword: newPassword,
			});
			//returns a success message if the request was successful
			if (response.status === 200) {
				return { message: "Updated password" };
			}
		} catch (err) {
			//Handling error codes
			if (!err?.response) {
				return Promise.reject("No server response");
			} else if (err.response?.status === 400) {
				return Promise.reject("Missing password");
			} else if (err.response?.status === 401) {
				return Promise.reject("Unauthorized");
			} else {
				return Promise.reject("Changing password failed");
			}
		}
	}
}

export default User;

import React, { useState } from "react";
import Axios from "axios";
//imports the components required to create and view posts
import PostList from "../components/Posts/PostList";
import PostForm from "../components/Posts/PostForm";
//imports components from the UI library
import { Divider, Text, Flex, ButtonGroup } from "@chakra-ui/react";
//uses the reusable css file
import "../pages.css";
//imports the reusable form input compontent
import FormInput from "../components/FormInput/FormInput";
//imports the component for the form to add new showtimes
import ShowtimeForm from "../components/Movie/ShowtimeForm";

function Admin() {
	//presets the empty value of the input field
	const [title, setTitle] = useState("");
	//presets the response message which can be displayed
	const [showtimeStatus, setShowtimeStatus] = useState("");
	const [moviesStatus, setMoviesStatus] = useState("");

	//sets search query to the new input
	const handleChange = (e) => {
		setTitle(e.target.value);
	};

	//function called when the button is pressed to get showtimes
	const getCineworldShowtimes = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//sends request to get showtimes for a given title
			await Axios.post("http://localhost:3001/showtimes/cineworld", {
				title: title,
			});
			//sets the response to be successful
			setShowtimeStatus("Successfully added Cineworld showtimes");
		} catch (err) {
			//handling errors
			if (!err.response) {
				setShowtimeStatus("Cineworld: No server response");
			} else if (err.response?.status === 400) {
				setShowtimeStatus("Cineworld: No movie found with that title");
			} else {
				setShowtimeStatus("Cineworld: Getting info failed");
			}
		}
	};
	//function called when the button is pressed to get showtimes
	const getVueShowtimes = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//sends request to get showtimes for a given title
			await Axios.post("http://localhost:3001/showtimes/vue", {
				title: title,
			});
			//sets the response to be successful
			setShowtimeStatus("Successfully added Vue showtimes");
		} catch (err) {
			//handling errors
			if (!err.response) {
				setShowtimeStatus("Vue: No server response");
			} else if (err.response?.status === 400) {
				setShowtimeStatus("Vue: No movie found with that title");
			} else {
				setShowtimeStatus("Vue: Getting info failed");
			}
		}
	};
	//function called when the button is pressed to add new movies to the database
	const updateMovies = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//sends request to get showtimes for a given title
			await Axios.get("http://localhost:3001/updateMovies");
			//sets the response to be successful
			setMoviesStatus("Updated movies successfully");
		} catch (err) {
			//handling errors
			if (!err.response) {
				setMoviesStatus("No server response");
			} else {
				setMoviesStatus("Updating movies failed");
			}
		}
	};

	//sets the properties of the input to be passed to the form input component
	const input = {
		id: 1,
		name: "title",
		type: "text",
		placeholder: "Get showtimes for a movie",
		errorMessage: "Title is required",
		label: "Movie title",
		required: true,
		pattern: "^.{1,64}$",
	};

	return (
		<div className="content">
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>Create and view posts</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			<div>
				<PostForm />
				<PostList />
			</div>
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>Update movies and showtimes</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>

			<button className="plain-button" onClick={updateMovies}>
				Get new movies from the database
			</button>
			<h3>{moviesStatus}</h3>
			<ShowtimeForm />
			<form className="form">
				<h1>Retrieve showtimes from a cinema</h1>
				<FormInput {...input} onChange={handleChange} />
				<h3>{showtimeStatus}</h3>
				<ButtonGroup>
					<button onClick={getCineworldShowtimes}>
						Get Cineworld showtimes
					</button>
					<button onClick={getVueShowtimes}>Get Vue showtimes</button>
				</ButtonGroup>
			</form>
		</div>
	);
}

export default Admin;

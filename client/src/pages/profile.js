import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
//imports the context to be able to access user details
import UserContext from "../context/UserContext";
//imports the dropdown component
import Select from "react-select";
//imports components from the UI library
import { Heading, Avatar, Box, Center, Text, Stack } from "@chakra-ui/react";
//imports the profile form component
import ProfileForm from "../components/Auth/ProfileForm";
//imports the edit icon
import { FaEdit } from "react-icons/fa";
//uses the reusable css file
import "../pages.css";

function Profile() {
	//gets the user details from the context
	const { user } = useContext(UserContext);

	//sets the form to be closed by default
	const [open, setOpen] = useState(false);

	//toggles the form to show or not show for the user
	const openForm = (e) => {
		//stops the page from reloading
		e.preventDefault();
		//toggles the open state
		setOpen((p) => !p);
	};

	//preset the selected genres list to be an empty list
	const [selected, setSelected] = useState([]);
	//preset the possible different genres to be an empty list
	const [data, setData] = useState([]);

	const [genreUpdateStatus, setGenreUpdateStatus] = useState("");

	//this function is called when the page loads and adds the users existing genres
	useEffect(() => {
		const getAllGenres = async () => {
			try {
				//sends a request to get all genres
				const response = await Axios.get("http://localhost:3001/genres");
				//presets an empty array for the genre options
				let arr = [];
				//iterates over the genres in the response
				for (var i = 0; i < response.data.genres.length; i++) {
					//adds each genre's name and id to the genre options array
					arr.push({
						label: response.data.genres[i].genre_name,
						value: response.data.genres[i].genre_id,
					});
				}
				//sets the data to be the genre options array
				setData(arr);
			} catch {
				console.log("Can't get genre options");
			}
		};
		//function to get the genres of the currently logged in user
		const getPrevGenres = () => {
			try {
				//sets the selected genres to be the user's genres from the context
				setSelected(user.genres);
			} catch (err) {
				console.log("Can't get user's options");
			}
		};
		getAllGenres();
		getPrevGenres();
	}, []);

	//handles changes of the dropdown
	const handleChange = (e) => {
		//sets the selected genres array to the ids of the genres selected in the dropdown
		setSelected(Array.isArray(e) ? e.map((x) => x.value) : []);
	};

	//function to call when the save button is pressed
	const saveGenres = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		//sets the user's genres to be the ones they selected
		user.genres = selected;
		//calls the save genres method of the user object
		try {
			await user.saveGenres();
		} catch (err) {
			setGenreUpdateStatus(err);
		}
	};

	return (
		<div className="content">
			<>
				<Center py={6} maxW={"100%"}>
					<Box
						maxW={"500px"}
						w={"full"}
						bg={"white"}
						boxShadow={"2xl"}
						rounded={"lg"}
						p={6}
						textAlign={"center"}
					>
						<Avatar size={"xl"} alt={"Avatar Alt"} mb={4} pos={"relative"} />
						<Heading fontSize={"2xl"} fontFamily={"body"}>
							Account details
						</Heading>
						<button onClick={openForm}>
							<FaEdit />
						</button>
						{open ? (
							<ProfileForm />
						) : (
							<Stack
								mt={8}
								direction={"column"}
								spacing={4}
								textAlign={"center"}
							>
								<Text textAlign={"left"} color={"gray.700"} px={3}>
									Username: {user.username}
								</Text>
								<Text textAlign={"left"} color={"gray.700"} px={3}>
									Firstname: {user.firstname}
								</Text>
								<Text textAlign={"left"} color={"gray.700"} px={3}>
									Lastname: {user.lastname}
								</Text>
								<Text textAlign={"left"} color={"gray.700"} px={3}>
									Email: {user.email}
								</Text>
							</Stack>
						)}
						<Heading fontSize={"2xl"} fontFamily={"body"}>
							Genre Preferences
						</Heading>
						<form className="plain-form" onSubmit={saveGenres}>
							<Select
								options={data}
								value={data.filter((obj) => selected.includes(obj.value))}
								onChange={handleChange}
								placeholder="Choose genres"
								isMulti
								isClearable
								closeMenuOnSelect={false}
							/>
							<button>Save genres</button>
							<h3 className="errorMessage">{genreUpdateStatus}</h3>
						</form>
					</Box>
				</Center>
			</>
		</div>
	);
}

export default Profile;

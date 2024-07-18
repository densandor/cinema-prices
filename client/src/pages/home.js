import React, { useEffect, useContext, useState } from "react";
//imports links from the site navigation library
import { Link } from "react-router-dom";
//uses the reusable CSS file
import "../pages.css";
//imports the context to be able to access user details
import UserContext from "../context/UserContext";
//imports components from the UI library
import {
	Box,
	Heading,
	Container,
	Text,
	Button,
	Stack,
	Flex,
	Divider,
} from "@chakra-ui/react";
//imports the movie list component
import MovieList from "../components/Movie/MovieList";
import Axios from "axios";
//imports the movie class compents
import Movie from "../components/Movie/movieClass";
//imports the reusable post list component to allow users to see admins' posts
import PostList from "../components/Posts/PostList";

function Home() {
	//gets the user details from the context
	const { user } = useContext(UserContext);
	//presets the films to be
	const [films, setFilms] = useState([]);
	//presets the response status which can be displayed
	const [searchStatus, setSearchStatus] = useState("");

	//function called when the page loads
	useEffect(() => {
		//function to get the latest movies
		const getMovies = async () => {
			try {
				//sends a request to the backend for latest movies
				const response = await Axios.get("http://localhost:3001/newMovies");
				//iterates through the movies in the backend
				for (let i = 0; i < response.data.foundMovies.length; i++) {
					let currentResult = response.data.foundMovies[i];
					//creates a movie object from each result
					let currentMovie = new Movie(...Object.values(currentResult));
					//appends each movie object to the films array
					setFilms((current) => [...current, currentMovie]);
				}
			} catch (err) {
				//handing errors
				if (!err.response) {
					setSearchStatus("No server response");
				} else {
					setSearchStatus("Getting info failed");
				}
			}
		};
		getMovies();
	}, []);

	return (
		<div className="content">
			<Container maxW={"3xl"}>
				<Stack
					as={Box}
					textAlign={"center"}
					spacing={{ base: 8, md: 14 }}
					py={{ base: 5, md: 10 }}
				>
					<Heading
						fontWeight={600}
						fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
						lineHeight={"110%"}
					>
						{user.user_id ? (
							<>
								Welcome back,
								<br />
								<Text as={"span"} color={"var(--purple)"}>
									{user.username}!
								</Text>
							</>
						) : (
							<>
								Welcome to a new era of <br />
								<Text as={"span"} color={"var(--purple)"} fontWeight={"bold"}>
									cinema
								</Text>
							</>
						)}
					</Heading>
					<Text color={"var(--dark)"}>
						Finding your next favourite movie has never been this easy.
					</Text>
					<Stack
						direction={"column"}
						spacing={2}
						align={"center"}
						alignSelf={"center"}
						position={"relative"}
					>
						<Link to="/search">
							<Button
								bg={"var(--purple)"}
								rounded={"full"}
								px={10}
								_hover={{
									bg: "var(--dark)",
								}}
								textColor={"var(--light)"}
							>
								Search for any movie
							</Button>
						</Link>

						{user.user_id ? (
							<Link to="/recommendations">
								<Button
									bg={"var(--purple)"}
									rounded={"full"}
									px={10}
									_hover={{
										bg: "var(--dark)",
									}}
									textColor={"var(--light)"}
								>
									Get your custom recommendations
								</Button>
							</Link>
						) : (
							<Link to="/register">
								<Button
									bg={"var(--purple)"}
									rounded={"full"}
									px={10}
									_hover={{
										bg: "var(--dark)",
									}}
									textColor={"var(--light)"}
								>
									Create an account
								</Button>
							</Link>
						)}
					</Stack>
				</Stack>
			</Container>
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>New movies</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			<MovieList movies={films} />
			{searchStatus}
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>Posts</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			<PostList />
		</div>
	);
}

export default Home;

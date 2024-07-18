import React, { useState, useEffect } from "react";
//imports the reusable movie list component for displaying recommendations
import MovieList from "../components/Movie/MovieList";
import Axios from "axios";
//imports the movie class to create movie objects
import Movie from "../components/Movie/movieClass";
//imports components from the UI library
import { Divider, Text, Flex } from "@chakra-ui/react";

function Recommendations() {
	//presets the response to be an empty list
	const [searchResults, setSearchResults] = useState([]);
	//presets the response message which can be displayed
	const [searchStatus, setSearchStatus] = useState("");
	//sets the pages to get to be 0 (the first page)
	const [pages, setPages] = useState(0);

	const getRecommendedMovies = async () => {
		try {
			//sends search request with pages
			const response = await Axios.get(
				"http://localhost:3001/recommendations",
				{
					params: { pages: pages },
				}
			);
			//iterates over the movies in the response
			for (let i = 0; i < response.data.foundMovies.length; i++) {
				let currentResult = response.data.foundMovies[i];
				//creates a movie object from each result
				let currentMovie = new Movie(...Object.values(currentResult));
				//appends the movie object to state
				setSearchResults((current) => [...current, currentMovie]);
			}
		} catch (err) {
			//handles errors
			if (!err.response) {
				setSearchStatus("No server response");
			} else {
				setSearchStatus("Getting info failed");
			}
		}
	};

	//function called when the load more button is pressed
	const handleLoadMore = (e) => {
		//prevents the page from reloading
		e.preventDefault();
		//increments the pages
		setPages((pages) => pages + 1);
	};

	//function called when the pages increments
	useEffect(() => {
		//gets the new set of recommendations
		getRecommendedMovies();
	}, [pages]);

	return (
		<div className="content">
			<Flex
				align="center"
				justifyContent={"center"}
				margin="0 10%"
				width="100%"
			>
				<Text padding={2}>Recommendations</Text>
				<Divider borderColor={"var(--dark)"} width={"80%"} />
			</Flex>
			{searchStatus}
			{searchResults.length > 0 ? (
				<>
					<MovieList movies={searchResults} />
					<button className="plain-button" onClick={handleLoadMore}>
						Load more
					</button>
				</>
			) : (
				<p>Unable to get recommendations</p>
			)}
		</div>
	);
}

export default Recommendations;

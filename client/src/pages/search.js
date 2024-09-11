import Axios from "axios";
import React, { useState, useEffect } from "react";
//imports the movie class
import Movie from "../components/Movie/movieClass";
//imports the movie list for displaying search results
import MovieList from "../components/Movie/MovieList";
//uses the reusable css file
import "../pages.css";
//imports the reusable form input compontent
import FormInput from "../components/FormInput/FormInput";
//imports the dropdown selector component
import Select from "react-select";
//imports components from the UI library
import { Divider, Text, Flex, InputGroup } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

function Search() {
	//presets the search query to be empty
	const [query, setQuery] = useState("");
	//presets the sort value to be sorting by title
	const [sortBy, setSortBy] = useState("title ASC");
	//sets the results to be an emtpy list
	const [searchResults, setSearchResults] = useState([]);
	//presets the response message which can be displayed
	const [searchStatus, setSearchStatus] = useState("");
	//sets the page to be 0 (1st page of results)
	const [pages, setPages] = useState(0);

	//function called when the user searches
	const search = async () => {
		try {
			//sends search request with query
			const response = await Axios.get("http://localhost:3001/search", {
				params: { queryItem: query, sortBy: sortBy, pages: pages },
			});
			//iterates over results
			for (let i = 0; i < response.data.foundMovies.length; i++) {
				//gets the current results
				let currentResult = response.data.foundMovies[i];
				//creates a movie object for each results
				let currentMovie = new Movie(...Object.values(currentResult));
				//appends each movie object to the results
				setSearchResults((current) => [...current, currentMovie]);
			}
			setSearchStatus("");
		} catch (err) {
			//handling errors
			if (!err.response) {
				setSearchStatus("No server response");
			} else {
				setSearchStatus("Getting movies failed");
			}
		}
	};

	//function to search f
	const submitSearch = (e) => {
		//resets the pages to the first one
		setPages(0);
		//prevents the page from reloading
		e.preventDefault();
		//reset the search results to an empty list
		setSearchResults([]);
		//call the search function
		search();
	};

	//sets search query to the new input
	const handleChange = (e) => {
		setQuery(e.target.value);
	};

	//function called when the sort by value changes
	const handleSortChange = (e) => {
		//resets the pages to the first one
		setPages(0);
		//sets the search results to an empty list
		setSearchResults([]);
		//changes the sort by value
		setSortBy(e.value);
	};

	//function called when the load more button is pressed
	const handleLoadMore = (e) => {
		//stops the page from reloading
		e.preventDefault();
		//increments the page of results to get
		setPages((pages) => pages + 1);
	};

	//function called whenever pages increments
	useEffect(() => {
		//checks if there is something to search for
		if (query.length > 0) {
			//searches for the next page of results
			search();
		}
	}, [pages, sortBy]);

	//sets the properties of the input to be passed to the form input component
	const input = {
		id: 1,
		name: "search",
		type: "text",
		placeholder: "Search for a movie...",
		errorMessage: "Movie title 1-64 characters required",
		required: true,
		pattern: "^.{1,64}$",
	};

	const options = [
		{ label: "Sort by Title", value: "title" },
		{ label: "Newest", value: "release_date DESC" },
		{ label: "Oldest", value: "release_date" },
		{ label: "Highest Rated", value: "rating DESC" },
	];

	return (
		<>
			<div className="content">
				<form className="plain-form" onSubmit={submitSearch}>
					<InputGroup>
						<FormInput {...input} onChange={handleChange} />
						<button className="search-button">
							<FaSearch />
							&nbsp;Search
						</button>
					</InputGroup>

					<h3>{searchStatus}</h3>
					<Select
						options={options}
						onChange={handleSortChange}
						defaultValue={options[0]}
						placeholder="Sort by"
					/>
				</form>
				<Flex
					align="center"
					justifyContent={"center"}
					margin="0 10%"
					width="100%"
				>
					<Text padding={2}>Results</Text>
					<Divider borderColor={"var(--dark)"} width={"80%"} />
				</Flex>
				{searchResults.length > 0 ? (
					<>
						<MovieList movies={searchResults} />
						<button className="plain-button" onClick={handleLoadMore}>
							Load more
						</button>
					</>
				) : (
					<p>Search our endless library of movies</p>
				)}
			</div>
		</>
	);
}

export default Search;

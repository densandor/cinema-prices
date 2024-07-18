import React from "react";
//imports link from site navigation library
import { Link } from "react-router-dom";

const MovieList = (props) => {
	//maps through each of the movies (which is passed as an array through it) and calls their displayMovie functions
	return (
		<>
			{props.movies.map((item, index) => (
				<Link to={"/movie/" + item.movie_id} key={item.movie_id}>
					<div className="movieItem">{item.displayMovie()}</div>
				</Link>
			))}
		</>
	);
};

export default MovieList;

import React, { useState, useEffect, useContext } from "react";
//imports the review class to create review objects
import Review from "./reviewClass";
import Axios from "axios";
//imports the review form component
import ReviewForm from "./ReviewForm";
//imports the context to be able to access user details
import UserContext from "../../context/UserContext";
//imports the link from the site navigation library
import { Link, useLocation } from "react-router-dom";
//uses the reusable CSS file
import "../../pages.css";

function ReviewList(props) {
	//gets the link of the current page to pass to the login if the user needs to sign in
	const location = useLocation();
	//presets the reviews array to be empty
	const [reviews, setReviews] = useState([]);
	//presets the existing review which will be passed to the review form component
	const [existingReview, setExistingReview] = useState(null);
	//gets the user details from the context of the site
	const { user } = useContext(UserContext);
	//gets movie id from link
	const id = props.movie_id;

	// function is called whenever the movie id changes
	useEffect(() => {
		//function that gets all reviews for a movie
		const getReviews = async () => {
			//sends request with movie id for reviws
			const response = await Axios.get("http://localhost:3001/review", {
				params: {
					id: id,
				},
			});
			//iterates over the review in the response
			for (let i = 0; i < response.data.reviewsArr.length; i++) {
				let currentResult = response.data.reviewsArr[i];
				//creates a new review object from each result
				let currentObj = new Review(...Object.values(currentResult));
				//cheks if its the user's review
				if (currentObj.user_id === user.user_id) {
					//sets the existing review to be the user's review
					setExistingReview(currentObj);
				} else {
					//adds the other reviews to the list of reviews
					setReviews((current) => [...current, currentObj]);
				}
			}
		};
		getReviews();
	}, [id]);

	return (
		<>
			{user.user_id ? (
				<ReviewForm movie_id={id} review={existingReview} />
			) : (
				<button className="plain-button">
					<Link to="/login" state={{ from: location }} replace>
						Sign in to leave review
					</Link>
				</button>
			)}
			{reviews.map((item, index) => (
				<div className="reviewItem" key={item.user_id}>
					{item.displayReview()}
				</div>
			))}
		</>
	);
}

export default ReviewList;

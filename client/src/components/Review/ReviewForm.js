import React, { useState, useEffect } from "react";
import Axios from "axios";
//imports the reusable form input component
import FormInput from "../FormInput/FormInput";
//imports the star rating component
import { Rating } from "react-simple-star-rating";
//imports components from the UI library
import { ButtonGroup } from "@chakra-ui/react";

function ReviewForm(props) {
	//gets the movie id from the values passed to it
	const id = props.movie_id;

	//sets the form to be closed by default
	const [open, setOpen] = useState(false);

	//toggles the form to show or not show for the user
	const openForm = (e) => {
		e.preventDefault();
		setOpen((p) => !p);
	};

	//presets the response statuses which can be displayed
	const [reviewStatus, setReviewStatus] = useState("");
	//presets the input values
	const [reviewValues, setReviewValues] = useState(undefined);

	//function called when a review object is passed to the component
	useEffect(() => {
		//presets the input values to be the existing values or nothing
		setReviewValues({
			title: props.review ? props.review.title : "",
			content: props.review ? props.review.content : "",
			score: props.review ? props.review.score : 1,
		});
	}, [props.review]);

	//function to send the review and display the results
	const submitReview = async (event) => {
		//stops the page from reloaded
		event.preventDefault();
		try {
			//sends a request to create the review with the details in the backend
			await Axios.post("http://localhost:3001/review", {
				movie_id: id,
				title: reviewValues["title"],
				content: reviewValues["content"],
				score: reviewValues["score"],
			});
			setReviewStatus("Successfully added review");
		} catch (err) {
			//handling error codes
			if (!err?.response) {
				setReviewStatus("No Server Response");
			} else if (err.response?.status === 400) {
				setReviewStatus("Missing a field");
			} else if (err.response?.status === 409) {
				setReviewStatus("Account has already reviewed this film");
			} else {
				setReviewStatus("Something went wrong");
			}
		}
	};

	//function to delete review
	const deleteReview = async (e) => {
		//stops the page from reloading
		e.preventDefault();
		try {
			//sends a request to delete the review in the backend
			await Axios.delete("http://localhost:3001/review", {
				data: { movie_id: id },
			});
			//sets the response status successfully
			setReviewStatus("Review deleted");
		} catch (err) {
			//handling error code
			if (!err?.response) {
				setReviewStatus("No Server Response");
			} else if (err.response?.status === 400) {
				setReviewStatus("Can't delete this review");
			} else {
				setReviewStatus("Something went wrong");
			}
		}
	};

	//changes the input values state at the name of the input to its value
	const handleChange = (e) => {
		//stops the page from reloading
		e.preventDefault();
		//sets the review input values to the previus values as well as the new value
		setReviewValues({ ...reviewValues, [e.target.name]: e.target.value });
	};

	//updates the rating when it changes
	const handleRatingChange = (newRating) => {
		setReviewValues({
			...reviewValues,
			score: newRating,
		});
		console.log(reviewValues.score);
	};

	//sets the properties of the inputs in the review form that are passed to the forminput components
	const inputs = [
		{
			id: 1,
			name: "title",
			type: "text",
			placeholder: "Give your review a title",
			errorMessage:
				"Review title 1-64 characters and no special characters is required",
			label: "Title",
			required: true,
			pattern: "^[a-zA-Z0-9]{1,64}$",
		},
		{
			id: 2,
			name: "content",
			type: "text",
			placeholder: "Add the review",
			errorMessage: "Review content 1-2048 characters is required",
			label: "Content",
			required: true,
			pattern: "^.{1,2048}$",
		},
	];

	return (
		<div className="content">
			<button className="plain-button" onClick={openForm}>
				{open ? <>Close</> : <>Add a review</>}
			</button>
			{open && (
				<>
					<form className="form" id="review" onSubmit={submitReview}>
						<h1>Leave a review</h1>
						{inputs.map((input) => (
							<FormInput
								key={input.id}
								{...input}
								value={reviewValues[input.name]}
								onChange={handleChange}
							/>
						))}
						<Rating
							initialValue={1}
							ratingValue={reviewValues.score}
							onClick={handleRatingChange}
							transition={true}
						/>
						<h3>{reviewStatus}</h3>
						<ButtonGroup>
							<button>Submit</button>
							<button className="plain-button" onClick={deleteReview}>
								Delete
							</button>
						</ButtonGroup>
					</form>
				</>
			)}
		</div>
	);
}

export default ReviewForm;

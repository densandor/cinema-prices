import React, { useState } from "react";
import Axios from "axios";
//imports the reusable form input component
import FormInput from "../FormInput/FormInput";
//imports components from the UI library
import { ButtonGroup } from "@chakra-ui/react";

function ReviewForm() {
	//sets the form to be closed by default
	const [open, setOpen] = useState(false);

	//toggles the form to show or not show for the user
	const openForm = (e) => {
		e.preventDefault();
		setOpen((p) => !p);
	};

	//presets the response statues which can be displayed
	const [postStatus, setPostStatus] = useState("");
	//presets the input values
	const [postValues, setPostValues] = useState({
		title: "",
		content: "",
	});

	//function to send the post and display the results
	const submitPost = async (event) => {
		//stops the page from reloaded
		event.preventDefault();
		try {
			//sends a request to create the post with the details in the backend
			await Axios.post("http://localhost:3001/posts", {
				title: postValues["title"],
				content: postValues["content"],
			});
			setPostStatus("Successfully added post");
		} catch (err) {
			//handling error codes
			if (!err?.response) {
				setPostStatus("No Server Response");
			} else if (err.response?.status === 400) {
				setPostStatus("Missing a field");
			} else {
				setPostStatus("Something went wrong");
			}
		}
	};

	//changes the input values state at the name of the input to its value
	const handleChange = (e) => {
		//stops the page from reloading
		e.preventDefault();
		//sets the post input values to the previus values as well as the new value
		setPostValues({ ...postValues, [e.target.name]: e.target.value });
	};

	//sets the properties of the inputs in the post form that are passed to the forminput components
	const inputs = [
		{
			id: 1,
			name: "title",
			type: "text",
			placeholder: "Give your post a title",
			errorMessage: "Title 1-64 characters is required",
			label: "Title",
			required: true,
			pattern: "^.{1,64}$",
		},
		{
			id: 2,
			name: "content",
			type: "text",
			placeholder: "Add the post",
			errorMessage: "Post content 1-2048 characters is required",
			label: "Content",
			required: true,
			pattern: "^.{1,2048}$",
		},
	];

	return (
		<div className="content">
			<button className="plain-button" onClick={openForm}>
				Add a post
			</button>
			{open && (
				<>
					<form className="form" id="post" onSubmit={submitPost}>
						<h1>Creating a new post</h1>
						{inputs.map((input) => (
							<FormInput
								key={input.id}
								{...input}
								value={postValues[input.name]}
								onChange={handleChange}
							/>
						))}
						<h3>{postStatus}</h3>
						<ButtonGroup>
							<button>Submit</button>
						</ButtonGroup>
					</form>
				</>
			)}
		</div>
	);
}

export default ReviewForm;

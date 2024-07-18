import React, { useState } from "react";
import Axios from "axios";
//imports the reusable form input component
import FormInput from "../FormInput/FormInput";
//imports date time picker library
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

function ShowtimeForm() {
	//presets the response statues which can be displayed
	const [showtimeStatus, setShowtimeStatus] = useState("");
	//presets the input values
	const [showtimeValues, setShowtimeValues] = useState({
		title: "",
		date: new Date(),
		price: "",
		cinemaName: "",
		link: "",
	});

	//function to send the showtime and display the results
	const submitShowtime = async (event) => {
		//stops the page from reloaded
		event.preventDefault();
		try {
			//sends a request to create the showtime with the details in the backend
			await Axios.post("http://localhost:3001/showtimes", {
				title: showtimeValues["title"],
				date: showtimeValues["date"],
				price: showtimeValues["price"],
				cinemaName: showtimeValues["cinemaName"],
				link: showtimeValues["link"],
			});
			setShowtimeStatus("Successfully added showtime");
		} catch (err) {
			console.log(err);
			//handling error codes
			if (!err?.response) {
				setShowtimeStatus("No Server Response");
			} else {
				setShowtimeStatus(err?.response?.data);
			}
		}
	};

	//changes the input values state at the name of the input to its value
	const handleChange = (e) => {
		//stops the page from reloading
		e.preventDefault();
		//sets the showtime input values to the previus values as well as the new value
		setShowtimeValues({ ...showtimeValues, [e.target.name]: e.target.value });
	};

	//sets the properties of the inputs in the showtime form that are passed to the forminput components
	const inputs = [
		{
			id: 0,
			name: "title",
			type: "text",
			placeholder: "Title of the movie to be shown",
			errorMessage: "Title with 1-64 characters required",
			label: "Title",
			required: true,
			pattern: "^.{1,64}$",
		},
		{
			id: 1,
			name: "price",
			type: "number",
			placeholder: "Enter a price for the showtime",
			errorMessage:
				"Price of the movie needs to be a number to 2 decimal places",
			label: "Price (£)",
			required: true,
			min: "0.01",
			max: "100",
			step: "0.01",
		},
		{
			id: 2,
			name: "cinemaName",
			type: "text",
			placeholder: "Enter the cinema name",
			errorMessage: "Cinema name with 1-128 characters is required",
			label: "Cinema name",
			required: true,
			pattern: "^.{1,128}$",
		},
		{
			id: 3,
			name: "link",
			type: "url",
			placeholder: "Add the link of the showing",
			errorMessage: "Link does not meet requirements",
			label: "Link",
		},
	];

	const dateOptions = {
		minDate: "today",
		maxDate: new Date().fp_incr(28),
		altInputClass: "hide",
		dateFormat: "Y-m-d H:i",
		time_24hr: true,
	};

	return (
		<div className="content">
			<form className="form" id="showtime" onSubmit={submitShowtime}>
				<h1>Create a new showtime</h1>
				{inputs.map((input) => (
					<FormInput
						key={input.id}
						{...input}
						value={showtimeValues[input.name]}
						onChange={handleChange}
					/>
				))}

				<label for="date">Date</label>
				<Flatpickr
					data-enable-time
					options={dateOptions}
					value={showtimeValues["date"]}
					onChange={([date]) => {
						setShowtimeValues({ ...showtimeValues, date: date });
					}}
				>
					<input type="text" id="date" placeholder="Select Date.." data-input />
				</Flatpickr>
				<h3>{showtimeStatus}</h3>
				<button>Submit</button>
			</form>
		</div>
	);
}

export default ShowtimeForm;

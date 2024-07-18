//imports the functions which are used to scrape the showtimes
const cineworldScraper = require("../webscraping/cineworldScraper");
const vueScraper = require("../webscraping/vueScraper");

//imports the functions which are used to access the database
const movieRepo = require("../repositories/movieRepository");

//function to add the showings to the database
const storeShowtimes = async (title, results) => {
	//gets the dates of each of lists of showtimes
	const dates = Object.keys(results);
	//iterates through the list of dates, which each have showtimes
	for (let i = 0; i < dates.length; i++) {
		//gets the current date
		let currentDate = dates[i];
		//gets the showtimes on that date
		let showTimes = results[currentDate];
		//checks if there are showings for that date
		if (showTimes.length > 0) {
			//iterates through the list of showings for a given date
			for (let j = 0; j < showTimes.length; j++) {
				let s = currentDate;
				//formats the time of the current showing
				let t = showTimes[j].showing_time.split(":");
				s = s.split(" ")[1].split("/");
				//formats the date of the showing
				let d = new Date(s[2], s[1] - 1, s[0], t[0], t[1]);
				//gets the price value as a number
				let price = Number(showTimes[j].price.slice(1));
				//adds the showing to the database
				await movieRepo.insertShowtime(
					title,
					showTimes[j].cinema_name,
					d,
					price,
					showTimes[j].link
				);
			}
		}
	}
};

const handleCineworldShowtimes = async (req, res) => {
	//gets the title of the movie from the request
	const { title } = req.body;

	try {
		//retrieves the showtimes from cineworld
		const cineworldResults = await cineworldScraper.getCineworldShowtimes(
			title
		);
		//stores them in the database
		await storeShowtimes(title, cineworldResults);

		//returns success message
		return res.status(200).json("Sucessfully stored cineworld results");
	} catch (error) {
		//returns an error if something goes wrong
		res.status(500).json(error);
	}
};

const handleVueShowtimes = async (req, res) => {
	//gets the title of the movie from the request
	const { title } = req.body;
	try {
		//retrieves the showtimes from vue
		const vueResults = await vueScraper.getVueShowtimes(title);
		//stores them in the database
		await storeShowtimes(title, vueResults);

		//returns success message
		return res.status(200).json("Successfully stored vue results");
	} catch (error) {
		//returns an error if something goes wrong
		res.status(500).json(error);
	}
};

const handleAddShowtime = async (req, res) => {
	//gets the showtime's details from the request
	const { title, date, price, cinemaName, link } = req.body;

	try {
		var days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		var d = new Date(date);
		var dayName = days[d.getDay()];
		var dateStrings = date.split("T")[0].split("-");
		dayName =
			dayName +
			" " +
			dateStrings[2] +
			"/" +
			dateStrings[1] +
			"/" +
			dateStrings[0];
		var results = {};
		results[dayName] = [
			{
				showing_time: date.slice(11, 16),
				cinema_name: cinemaName,
				link: link,
				price: "£" + price,
			},
		];
		await storeShowtimes(title, results);
		res.status(200).json({ message: "Showtime added successfully" });
	} catch (error) {
		//returns an error if something goes wrong
		res.status(500).json(error);
	}
};

module.exports = {
	handleCineworldShowtimes,
	handleVueShowtimes,
	handleAddShowtime,
};

const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");

//CSS to remove the animations from the website
const removeAnimations = {
	content: `
*,
*::after,
*::before {
transition-delay: 0s !important;
transition-duration: 0s !important;
animation-delay: -0.0001s !important;
animation-duration: 0s !important;
animation-play-state: paused !important;
caret-color: transparent !important;
}`,
};

//function to get the showtimes for a given vue location
const getVueLocationTimes = async (browser, url) => {
	//creates a new page
	const page = await browser.newPage();
	//changes the size of the page
	await page.setViewport({ width: 1280, height: 720 });
	//goes to the movie's page
	await page.goto(`${url}`, { waitUntil: "networkidle2" });
	//waits for the loading element to be finished
	await page.waitForSelector("#showing__times > div.loader", { hidden: true });
	//gets the results from the page
	const currentResults = await page.evaluate(() => {
		//funtion to convert the times
		const convertTime12to24 = (time12h) => {
			//splits into the time and the AM/PM
			const [time, modifier] = time12h.split(" ");
			//splits into minute and hour
			let [hours, minutes] = time.split(":");
			//converts hours
			if (hours === "12") {
				hours = "00";
			}
			if (modifier === "PM") {
				hours = parseInt(hours, 10) + 12;
			}
			//returns the times
			return `${hours}:${minutes}`;
		};
		//presets the results object
		let locationResults = {};
		//gets all the showtime elements
		const times = document
			.querySelector("#showing__times")
			.getElementsByClassName("small");
		//gets the name of the cinema from the dropdown
		const cinemaName = document.querySelector(
			"#main > div.container.full-width > div > div > div.title__overview > div.overview__details > div.title__times > div.times__venue > span > a"
		).innerHTML;
		//iterates over the showings
		for (let i = 0; i < times.length; i++) {
			let currentShowing = times[i];
			let dateStrings = currentShowing
				.closest("div.day")
				.querySelector("time")
				.dateTime.split("-");
			//gets the date of the showing
			let date =
				currentShowing.closest("div.day").querySelector("abbr").title +
				" " +
				dateStrings[2] +
				"/" +
				dateStrings[1] +
				"/" +
				dateStrings[0];
			//checks if the results contain an array for a given date
			if (!locationResults[date]) {
				//add an empty array for a date
				locationResults[date] = [];
			}
			//gets the time of the showing
			let timeString = currentShowing.querySelector("time").innerHTML;
			//converts the time
			let time = convertTime12to24(timeString);
			let link = currentShowing.href;
			//creates an object with the showing's details
			let currentResult = {
				showing_time: time,
				cinema_name: cinemaName,
				link: link,
			};
			//checks if the prices are displayed on this page
			let pricingElement = document
				.querySelector("#showing__times")
				.getElementsByClassName("small")[0]
				.querySelector("span.session_pricing");
			if (pricingElement != null) {
				//gets the price of the showing
				let price = pricingElement.innerHTML;
				currentResult.price = price;
			}
			//adds the showing to the location
			locationResults[date].push(currentResult);
		}
		//returns the showings for this location
		return locationResults;
	});
	//closes the page
	await page.close();
	//returns the vue showings
	return Promise.resolve(currentResults);
};

//function to get the price for a given vue showing
const getVuePrice = async (browser, url) => {
	//opens a new page
	const page = await browser.newPage();
	//goes to the link of the vue showing
	await page.goto(`${url}`, { waitUntil: "load" });
	//waits for the prices to show up
	await page.waitForXPath(
		"/html/body/div[1]/main/div[6]/div[2]/div[2]/div/ul",
		{ visible: true }
	);
	//gets the price from the page
	const price = await page.evaluate(() => {
		//gets all the price elements
		const priceOptions = Array.from(
			document.querySelectorAll(
				"#booking-container > div.dynamic-pricing_seats_map > div.seats-maplegend > ul > li.seats-maplegend__item > span.legend-text > strong"
			)
		);
		//gets the price values from each of the price elements
		const priceValues = priceOptions.map((price) =>
			Number(price.innerHTML.slice(1))
		);
		//gets the minimum price from the prices
		const smallestPrice = Math.min(...priceValues);
		//creates a string with the price
		const priceString = "£" + smallestPrice;
		//returns the price
		return priceString;
	});
	//closes the page
	await page.close();
	//returns the price
	return Promise.resolve(price);
};

const getVueShowtimes = async (title) => {
	try {
		//opens the browser
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: executablePath(),
		});
		//creates a new page
		let page = await browser.newPage();
		//changes the size of the browser
		await page.setViewport({ width: 1280, height: 720 });
		//goes to the vue page
		await page.goto("https://www.myvue.com/");
		//adds the css to the page to get rid of animations
		await page.addStyleTag(removeAnimations);
		//waits for the cookies tag to appear
		await page.waitForXPath(
			"/html/body/div[5]/div[3]/div/div/div[2]/div[2]/div/div[2]/button"
		);
		//clicks the cookies reject button
		await page.click("#onetrust-reject-all-handler");
		//clicks the movies search button
		await page.click(
			"#qb > div.container.container-small.quick-book__container > div > div > span:nth-child(2) > a"
		);
		//types the title of the movie
		await page.type("[id=search-film-event]", title);
		//waits for the movie list to show up
		await page.waitForXPath(
			"/html/body/div[2]/div/div[1]/div/div/span[2]/aside/div/div[1]/div/div/ul/li[@style='']"
		);
		//selects the button of the film
		const filmButton = await page.$x(
			"/html/body/div[2]/div/div[1]/div/div/span[2]/aside/div/div[1]/div/div/ul/li[@style='']"
		);
		//checks if there is a film button available
		if (filmButton.length === 0) {
			throw new Error("No movies shown with that title");
		} else {
			console.log("Showtime results found");
		}
		//clicks the film button
		await filmButton[0].click();
		//gets the link of the movie page
		const moviePageUrl = await page.evaluate(() => {
			const searchButtonUrl = document.querySelector(
				"#qb > div.container.container-small.quick-book__container > div > a"
			).href;
			return searchButtonUrl + "/times";
		});
		//visits the link
		await page.goto(moviePageUrl, { waitUntil: "networkidle2" });

		await page.waitForFunction(
			'document.querySelector("#main > div.container.full-width > div > div > div.title__overview > div.overview__details > div.title__times > div.times__venue > span > a").innerHTML.includes("")'
		);
		//waits for the venues dropdown to be finished
		await page.click(
			"#main > div.container.full-width > div > div > div.title__overview > div.overview__details > div.title__times > div.times__venue > span > a"
		);
		//searches for the locations
		await page.type("[id=search-venues]", "London");
		//gets the links for each of the cinemas
		const locationLinks = await page.$$eval(
			"aside.overlay--select-cinema > div > div.scroll-child > div > div > ul:nth-child(13) > li:not(.hidden) > a",
			(a) => a.map((e) => e.href.slice(0, -8))
		);
		//gets the end of the URL to be used with the locations' links
		const moviePageUrlEnding = moviePageUrl.slice(22);

		//gets an array with the with the showings for each location
		const showingsByLocation = await Promise.all(
			locationLinks.map((link) => {
				const locationShowings = getVueLocationTimes(
					browser,
					link + moviePageUrlEnding
				);
				return locationShowings;
			})
		);

		//presets an empty array for the results
		let results = {};

		//iterates over the locations
		for (let locationObj of showingsByLocation) {
			//gets the showings' dates in each location
			let dates = Object.keys(locationObj);
			//iterates over the showing dates in each location
			for (let date of dates) {
				//checks if the results object contains the current date
				if (!results[date]) {
					//adds a new array with the date into the results
					results[date] = [];
				}
				//iterates over the showings at that date and adds them to results
				for (let showing of locationObj[date]) {
					results[date].push(showing);
				}
			}
		}

		//gets the dates of all the showtime results
		let dates = Object.keys(results);
		//iterates over the dates
		for (let i = 0; i < dates.length; i++) {
			let currentDate = dates[i];
			//gets all the showings at that date
			let showingsByDate = results[currentDate];
			//gets the showings that don't have a price
			let showingsWithoutPrice = showingsByDate.filter(
				(obj) => obj.price === undefined
			);

			//preset the prices array
			const prices = [];
			//set the number of prices to get at the same time
			const chunkLength = 16;

			//iterate through all the showings
			for (
				let j = 0, len = showingsWithoutPrice.length;
				j < len;
				j += chunkLength
			) {
				//get the chunks of showings from the showings
				const chunkOfShowings = showingsWithoutPrice.slice(j, j + chunkLength);
				//gets the prices for those showings
				const chunkOfPrices = await Promise.all(
					chunkOfShowings.map((showing) =>
						getVuePrice(browser, showing.link).catch((err) => console.log(err))
					)
				);
				//add the prices to the prices array
				prices.push(...chunkOfPrices);
			}
			//iterates over the prices and adds them to the showings that don't have a price
			prices.forEach((price, index) => {
				if (!results[currentDate][index].price) {
					results[currentDate][index].price = price;
				}
			});
		}
		//closes the browser
		await browser.close();
		//returns the results
		return results;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = { getVueShowtimes };

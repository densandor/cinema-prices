const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");

//function to get the price of a cineworld showing
const getCineworldPrice = async (browser, url) => {
	//creates a new page
	const page = await browser.newPage();
	//visits the link of the showing
	await page.goto(`${url}`, { waitUntil: "networkidle2" });
	//wait for the backdrop
	await page.waitForFunction(
		'document.querySelector("#abv > div > div.abv-content > div.abv-routes > div:nth-child(3) > div > div > div > div > div > div > div:nth-child(6) > div.select-tickets_row-controls > div:nth-child(1) > div:nth-child(2) > div.select-tickets_row-amount").innerHTML.includes("£")'
	);
	//gets the price from the page
	const price = await page.evaluate(() => {
		const priceValue = document.querySelector(
			"#abv > div > div.abv-content > div.abv-routes > div:nth-child(3) > div > div > div > div > div > div > div:nth-child(6) > div.select-tickets_row-controls > div:nth-child(1) > div:nth-child(2) > div.select-tickets_row-amount"
		).innerHTML;
		return priceValue;
	});
	//closes the page
	await page.close();
	//returns the price
	return Promise.resolve(price);
};

const getCineworldShowtimes = async (title) => {
	try {
		//opens the browser
		const browser = await puppeteer.launch({
			headless: false,
			executablePath: executablePath(),
		});
		//creates a new page
		let page = await browser.newPage();
		//visits the cineworld website
		await page.goto("https://www.cineworld.co.uk/#/");

		//accept cookies
		await page.waitForSelector("#onetrust-reject-all-handler");
		await page.click("#onetrust-reject-all-handler");
		//wait for the cookies banner to disappear
		await page.waitForSelector("#onetrust-pc-dark-filter", { hidden: true });
		console.log("Cookies done");
		//get the film search button
		const byFilmButton = await page.$x(
			"/html/body/section[1]/section/div[1]/div/div[2]/div[1]/div/button[2]"
		);
		console.log("Found 'by film' button");
		//click to search by film
		await byFilmButton[0].click();
		console.log("Clicked 'by film' button");
		//wait for the choose film to load
		await page.waitForXPath(
			"/html/body/section[1]/section/div[1]/div/div[2]/div[2]/div/div[1]/div/div/button[@class='btn dropdown-toggle btn-default' and @title='Choose a film']"
		);
		console.log("Found dropdown");
		//press the 'choose a film' dropdown
		await page.click(
			"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > div > div:nth-child(2) > div.col-sm-7.col-sm-pull-5 > div > div.col-sm-5.qb-movie-select.col-xs-8 > div > div > button"
		);
		console.log("Clicked dropdown");
		//type the title of the film
		await page.type("[name=searchBox]", title);
		console.log("Typed title");
		//check if the no results message is displayed
		const noresults = await page.$(
			"body > div.selectpicker-dropdown-container.npm-quickbook > div.bs-container.btn-group.bootstrap-select.qb-.dropup.open > div > ul > li.no-results"
		);
		if (noresults !== null) {
			console.log("No showtime results found");
			//return error message if no results found
			throw new Error("No movies shown with that title");
		} else {
			console.log("Showtime results found");
		}

		//clicks the movie in the dropdown
		await page.click(
			"body > div.selectpicker-dropdown-container.npm-quickbook > div.bs-container.btn-group.bootstrap-select.qb-.open > div > ul > li.active > a > span.text"
		);

		//wait for the location dropdown
		await page.waitForXPath(
			"/html/body/section[1]/section/div[1]/div/div[2]/div[2]/div/div[3]/div/div/button[@class='btn dropdown-toggle btn-default' and @title='Choose a location']"
		);
		//click the location dropdown
		await page.click(
			"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > div > div:nth-child(2) > div.col-sm-7.col-sm-pull-5 > div > div.qb-cinema-group-select.col-xs-12.col-sm-5 > div > div > button"
		);
		//search for the location
		await page.type("[name=searchBox]", "London");
		//choose the location
		await page.click(
			"body > div.selectpicker-dropdown-container.npm-quickbook > div.bs-container.btn-group.bootstrap-select.qb-.open > div > ul > li.active > a"
		);
		//wait for the date buttons to load
		await page.waitForXPath(
			"/html/body/section[1]/section/div[1]/div/div[3]/div[1]/div/div[1][@class='qb-days-group btn-group']"
		);

		//gets the buttons of the different dates
		const dateSelector =
			"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > div > div:nth-child(3) > div.col-sm-12.col-md-6.qb-calendar-widget > div > div.qb-days-group.btn-group > button.btn-default";

		const dateButtons = await page.$$(dateSelector);

		let results = {};
		//iterates through the date buttons
		for (const button of dateButtons) {
			//click the date button
			await button.click();
			//wait for the showtimes to show up
			await page.waitForXPath(
				"/html/body/section[1]/section/div[1]/section/div[2]/div[1][@class='row movie-row first-movie-row']",
				{ timeout: 500 }
			);
			//check if there are no showtimes for a given date
			const noTimes = await page.$(
				"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > div:nth-child(2) > div"
			);
			if (noTimes !== null) {
				console.log("No times found for a date");
			} else {
				//if there are showtimes, retrieve the date and the showtimes for it
				const [date, showingList] = await page.evaluate(() => {
					//preset the showtimes array
					let showings = [];
					//select the date
					const date = document.querySelector(
						"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > div > div:nth-child(3) > div.col-sm-12.col-md-6.qb-calendar-widget > div > div.col-xs-12.mb-sm > h5"
					).innerHTML;
					//get all the showtime elements
					const times = document
						.querySelector(
							"body > section.light.quickbook-section.npm-quickbook > section > div.qb.qb-by-film > section > div.container"
						)
						.getElementsByClassName("btn btn-primary btn-lg");
					//iterate over the showtime elements
					for (let i = 0; i < times.length; i++) {
						let currentShowing = times[i];
						let cinemaName =
							"Cineworld " +
							currentShowing.closest(".row.movie-row").querySelector("h4")
								.innerText;
						let time = currentShowing.innerText;
						let link = currentShowing.dataset.url;
						//add the showtime information to the array
						showings.push({
							showing_time: time,
							cinema_name: cinemaName,
							link: link,
						});
					}
					return [date, showings];
				});
				//preset the prices array
				const prices = [];
				//set the number of prices to get at the same time
				const chunkLength = 20;

				//iterate through all the showings
				for (let j = 0, len = showingList.length; j < len; j += chunkLength) {
					//get the chunks of showings from the showings
					const chunkOfShowings = showingList.slice(j, j + chunkLength);
					//gets the prices for those showings
					const chunkOfPrices = await Promise.all(
						chunkOfShowings.map((showing) =>
							getCineworldPrice(browser, showing.link).catch((err) =>
								console.log(err)
							)
						)
					);
					//add the prices to the prices array
					prices.push(...chunkOfPrices);
				}
				//iterate through the showings
				for (let i = 0; i < showingList.length; i++) {
					//add the price for each one from the prices array
					showingList[i].price = prices[i];
				}
				//add the results for a given date
				results[date] = showingList;
			}
		}
		//close the browser
		await browser.close();
		//return the showtimes
		return results;
	} catch (error) {
		//return an error if something goes wrong
		throw new Error("Something went wrong with showtimes");
	}
};

module.exports = { getCineworldShowtimes };

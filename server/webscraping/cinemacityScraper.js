const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");

const LOCATION = "Budapest";
const CONVERSION = 500;

//CSS to remove the animations from the website
const removeAnimations = {
	content: `*,
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

//function to get the price of a cineworld showing
const getCinemacityPrice = async (browser, url) => {
	var priceToReturn;
	const page = await browser.newPage();
	try {
		//visits the link of the showing
		await page.goto(`${url}`, { timeout: 10000, waitUntil: "networkidle2" });

		//select to buy tickets
		await page.waitForXPath(
			"/html/body/form/div[3]/div/div[7]/div/div[3]/input",
			{ timeout: 5000 }
		);
		await page.click("#rbp");

		//press next
		await page.click(
			"#pagecontainer > div > div.main.fullwidth > div > div.actionHolder > a.nextBtn"
		);

		//gets the price from the page
		await page.waitForXPath(
			"/html/body/form/div[3]/div/div[8]/div/div[3]/table/tbody/tr[2]/td[2]/span",
			{ timeout: 5000 }
		);
		const price = await page.evaluate(() => {
			let priceValue = document.querySelector("#lblPrice").innerHTML;
			priceValue = parseInt(priceValue.split(".")[0].match(/\d/g).join(""), 10);
			return priceValue;
		});

		priceToReturn = (Math.round((price / CONVERSION) * 100) / 100).toString();
	} catch (error) {
		priceToReturn = "0";
	} finally {
		//closes the page
		await page.close();
		return Promise.resolve(priceToReturn);
	}
};

const getCinemacityShowtimes = async (title) => {
	try {
		//opens the browser and creates a new page
		const browser = await puppeteer.launch({
			headless: false,
			executablePath: executablePath(),
		});
		let page = await browser.newPage();
		await page.addStyleTag(removeAnimations);
		//visits the cineworld website
		await page.goto("https://www.cinemacity.hu/?lang=en_GB#/");
		//type the title of the film
		await page.type("[name=query]", title);
		console.log("Typed title");
		//check if the no results message is displayed
		const noresults = await page.$("li.no-results");
		if (noresults.length > 0) {
			console.log("No showtime results found");
			throw new Error("No movies shown with that title");
		} else {
			console.log("Showtime results found");
		}

		//clicks the movie in the dropdown
		await page.waitForXPath(
			"/html/body/div[2]/div/div[1]/div[1]/div/div[2]/nav/div/ul/li[3]/form/div[2]/ul/li/a"
		);
		await page.click("#search-results > ul > li > a");

		//book now button
		await page.waitForXPath(
			"/html/body/div[4]/section[1]/div/div[2]/div[1]/div/div/a"
		);
		await page.click(
			"#trailer > div > div.movie-trailer > div:nth-child(1) > div > div > a"
		);

		//location dropdown
		await page.waitForTimeout(1000);

		// await page.waitForXPath(
		// 	"/html/body/div[17]/div/div/div/div[2]/div[3]/div[2]/div/div/div/button/span[1]"
		// );
		await page.click(
			"body > div.modal.location-picker-modal.fade.search.in > div > div > div > div:nth-child(2) > div:nth-child(3) > div.row.all-cinemas-list > div > div > div > button"
		);

		//search for the location
		await page.waitForXPath("/html/body/div[12]/div[2]/div/div/input");
		await page.type("[name=searchBox]", LOCATION);
		await page.click(
			"body > div.selectpicker-dropdown-container.npm-quickbook > div.bs-container.btn-group.bootstrap-select.qb-.open > div > ul > li.active > a"
		);

		//wait for the date buttons to load
		await page.waitForXPath(
			"/html/body/section[2]/section/div[1]/div/div/div[2]/div[1]/div/div[2]/h5"
		);
		//gets the buttons of the different dates
		const dateSelector =
			"body > section.light.quickbook-section.npm-quickbook > section > div:nth-child(1) > div > div > div:nth-child(2) > div.col-sm-12.col-md-6.qb-calendar-widget > div > div.qb-days-group.btn-group > button.btn-default:not(.disabled)";
		const dateButtons = await page.$$(dateSelector);
		console.log(dateButtons);
		let results = {};
		//iterates through the date buttons
		for (let button of dateButtons) {
			//click the date button
			await button.click();
			console.log("Clicked button");
			//wait for the showtimes to show up
			await page.waitForXPath(
				"/html/body/section[2]/section/div[1]/div/section/div[2]/div[1]",
				{ timeout: 500 }
			);
			console.log("Waited for showtimes");
			const [date, showingList] = await page.evaluate(() => {
				//preset the showtimes array
				let showings = [];
				//select the date
				let date = document.querySelector(
					"body > section.light.quickbook-section.npm-quickbook > section > div:nth-child(1) > div > div > div:nth-child(2) > div.col-sm-12.col-md-6.qb-calendar-widget > div > div.col-xs-12.mb-sm > h5"
				).innerHTML;
				//get all the showtime elements
				const times = document
					.querySelector(
						"body > section.light.quickbook-section.npm-quickbook > section > div:nth-child(1) > div > section > div.container"
					)
					.getElementsByClassName("btn btn-primary btn-lg");
				//iterate over the showtime elements
				for (let i = 0; i < times.length; i++) {
					let currentShowing = times[i];
					let cinemaName =
						"Cinemacity " +
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
			console.log(showingList.length);
			for (let j = 0, len = showingList.length; j < len; j += chunkLength) {
				//get the chunks of showings from the showings
				let chunkOfShowings = showingList.slice(j, j + chunkLength);
				//gets the prices for those showings
				let chunkOfPrices = await Promise.all(
					chunkOfShowings.map((showing) =>
						getCinemacityPrice(browser, showing.link).catch((err) => {
							console.log(err);
						})
					)
				);
				console.log(chunkOfPrices);
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
		//close the browser
		await browser.close();
		//return the showtimes
		return results;
	} catch (error) {
		//return an error if something goes wrong
		throw new Error("Something went wrong with showtimes");
	}
};

module.exports = { getCinemacityShowtimes };

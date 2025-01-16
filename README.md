# 🎬 CinemaPrices

<br>

This full-stack website helps users discover their next favorite movie by allowing them to search for films, receive personalized recommendations, read and leave reviews, and check real-time cinema ticket prices scraped from multiple cinema chains. The platform offers personalized suggestions based on user preferences, while the review feature lets users share their thoughts on movies. It creates a tailored movie discovery experience, making it easy to find films and book tickets at the best prices. Built with React, Node.js, and MySQL, it provides a user-friendly interface and efficient backend for fast, relevant movie data and price comparisons.

<br>

## Features

Regular users can:

- Search for movies to get information about them.
- Find showtimes, each with a price and a link directly to booking.
- Write, update and delete reviews with ratings, which impact the average rating of the movie.
- Recieve custom recommendations based on their preferred genres.
- Register for an account, sign in or out and remain signed in with cookies.
- Update their account details, password or preferred movie genres.

Admin users can also:

- Add or remove posts, which can be used to display news about movies or the website.
- Add the latest movies to the database using [TMDB API](https://developer.themoviedb.org/docs/getting-started).
- Manually add showtimes for a movie to the database.
- Automatically add showtimes for a movie for certain cinema chains to the database using webscraping.

<br>

## Usage

1. Ensure you have node (developed with v18.0.0), MySQL (developed with v8.0.29) and npm.
2. Clone the git reporsitory.
3. Import the database file into MySQL and ensure MySQL is running.
4. Ensure you add the correct TMDB API key, admin usernames, MySQL username and MySQL password into the `server/config/config.js` file.
5. Install the dependencies for the frontend and the backend with `npm ci` in both the `client` and the `server` directories.
6. Start the backend and the frontend in two terminals with `npm start` in both the `client` and the `server` directories.

<br>

## Technologies Used

- Frontend: React.js
  - UI: Chakra UI
- Backend: Node.js
  - Routing: Express.js
  - Validation: Yup
  - Webscraping: Puppeteer
- Database: MySQL

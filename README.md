# CinemaPrices

A full-stack JavaScript website allowing users to:

- Search for movies to get information about them.
- Find showtimes, each with a price and a link directly to booking.
- Write, update and delete reviews with ratings, which impact the average rating of the movie.
- Recieve custom recommendations based on their preferred genres.
- Register for an account, sign in or out and remain signed in with cookies.
- Update their account details, password or preferred movie genres.

Admin users are also able to:

- Add or remove posts, which can be used to display news about movies or the website.
- Add the latest movies to the database using TMDB API.
- Manually add showtimes for a movie to the database.
- Automatically add showtimes for a movie for certain cinema chains to the database using webscraping.

<br/>

## How to build

1. Ensure you have node (developed with v18.0.0), MySQL (developed with v8.0.29) and npm.
2. Clone the git reporsitory.
3. Import the database file into MySQL and ensure MySQL is running.
4. Ensure you add the correct TMDB API key, admin usernames, MySQL username and MySQL password into the `server/config/config.js` file.
5. Install the dependencies for the frontend and the backend with `npm ci` in both the `client` and the `server` directories.
6. Start the backend and the frontend in two terminals with `npm start` in both the `client` and the `server` directories.

<br/>

## Technologies Used

- Frontend: React.js
  - UI: Chakra UI
- Backend: Node.js
  - Routing: Express.js
  - Validation: Yup
  - Webscraping: Puppeteer
- Database: MySQL

This project is for educational purposes only.

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const PORT = process.env.PORT || 3001;
const errorHandler = require("./error/errorHandler");

//mddleware for JSONs
app.use(express.json());

//Cross Origin Resource Sharing
app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	})
);

//middleware for handling data from forms
app.use(bodyParser.urlencoded({ extended: true }));

//middleware for session and cookies
app.use(
	session({
		key: "userID",
		secret: "secret123",
		resave: false,
		saveUninitialized: false,

		cookie: {
			expires: 1000 * 60 * 10,
			sameSite: "strict",
		},
	})
);

//the routes the frontend can access
app.use("/login", require("./routes/login"));
app.use("/user", require("./routes/user"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refresh"));
app.use("/search", require("./routes/search"));
app.use("/movieDetails", require("./routes/movieDetails"));
app.use("/review", require("./routes/review"));
app.use("/genres", require("./routes/genres"));
app.use("/recommendations", require("./routes/recommendations"));
app.use("/updateMovies", require("./routes/updateMovies"));
app.use("/newMovies", require("./routes/newMovies"));
app.use("/showtimes", require("./routes/showtimes"));
app.use("/posts", require("./routes/posts"));

//error handling middleware
app.use(errorHandler);

//server running
app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});

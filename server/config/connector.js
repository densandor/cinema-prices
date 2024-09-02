const mysql = require("mysql2/promise");
const config = require("../config/config");

//creates a new connection to the database
const con = mysql.createPool({
	host: "localhost",
	user: config.user,
	password: config.pwd,
	database: "cinema_project",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

module.exports = con;

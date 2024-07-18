const mysql = require("mysql2/promise");

//creates a new connection to the database
const con = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "root",
	database: "cinema_project",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

module.exports = con;

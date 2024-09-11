const errorObj = require("./errorClass");

function errorHandler(err, req, res, next) {
	console.error(err);
	//checks if the error is an error object and sends its code and message
	if (err instanceof errorObj) {
		return res.status(err.code).json(err.message);
	}
	//sends a generic error message otherwise
	return res.status(500).json("Server error - something went wrong");
}

module.exports = errorHandler;

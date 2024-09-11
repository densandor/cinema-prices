//imports the error class to be able to return an instance of it
const errorObj = require("../error/errorClass");

function validateData(schema) {
	return async (req, res, next) => {
		try {
			//validates different parts of the request according to the schema passed to the function
			const validatedResults = await schema.validate({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			//sets the request to be the new validated versions
			req.body = validatedResults.body;
			req.query = validatedResults.query;
			req.params = validatedResults.params;
			//request moves on to the endpoint
			next();
		} catch (err) {
			//creates an error using the error class if the validation doesn't pass
			next(errorObj.badRequest(err));
		}
	};
}

module.exports = validateData;

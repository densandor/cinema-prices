class errorObj {
	constructor(status, msg) {
		this.code = status;
		this.message = msg;
	}

	//creates a new error with status 400
	static badRequest(msg) {
		return new errorObj(400, msg);
	}
}

module.exports = errorObj;

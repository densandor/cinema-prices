//function to create a fake request with the input details
const mockReq = (properties) => {
	//creates an empty object
	const req = {};
	//sets the values for the passed values
	req.body = properties?.bodyData || {};
	req.query = properties?.queryData || {};
	//returns the obect
	return req;
};

//funcion to create a mock response
const mockRes = () => {
	//presets an empty object
	const res = {};
	//adds mock values to the status and the json properties
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	//returns the object
	return res;
};

module.exports = { mockReq, mockRes };

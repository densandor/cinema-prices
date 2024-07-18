let PASSWORD = "";

//imports the function which is called when the endpoint is reached
const loginController = require("../controllers/loginController");

//imports the mock request and response objects
const { mockReq, mockRes } = require("../tests/testMocks");

test("Login passes validation and is stored in the session", async () => {
	//gets the function from the login endpoint
	const loginFunction = loginController.handleLogin;
	//creates a mocked request with the correct details
	const mockedReq = mockReq({
		bodyData: { username: "admin", password: PASSWORD },
	});
	//creates a mocked response
	const mockedRes = mockRes();
	//waits for the login funtion to be carried out
	await loginFunction(mockedReq, mockedRes);
	//tests if the correct status is called in the response
	expect(mockedRes.status).toHaveBeenCalledWith(200);
});

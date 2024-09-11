//imports the validation function
const validateData = require("../validation/validator");
//imports the schema to validate the data by
const { registerSchema } = require("../validation/validationSchemas");
//imports the mock request and response objects
const { mockReq, mockRes } = require("../tests/testMocks");

test("Validation for the registration form", async () => {
	//gets mock of the next function
	const mockedNext = jest.fn();
	//gets a mock of the request with the correct data
	const mockedReq = mockReq({
		bodyData: {
			username: "username123",
			firstname: "John",
			lastname: "Johnson",
			email: "test@email.com",
			password: "somePASS!23",
		},
	});
	//creates a mocked response
	const mockedRes = mockRes();

	//gets the function in the validator with the correct validation schema
	const validatorFunction = validateData(registerSchema);

	//calls the function in the validator
	await validatorFunction(mockedReq, mockedRes, mockedNext);

	//tests if the validation passes (no errors are called when the funcion)
	expect(mockedNext).toHaveBeenCalledWith();
});

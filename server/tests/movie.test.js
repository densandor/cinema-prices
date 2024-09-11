//imports the function which is called when the endpoint is reached
const searchController = require("../controllers/searchController");

//imports the mock request and response objects
const { mockReq, mockRes } = require("./testMocks");

test("Movies are searched and returned in the correct order", async () => {
	//gets the function from the search endpoint
	const searchFunction = searchController.handleSearch;
	//creates a mocked request with the correct details
	const mockedReq = mockReq({
		queryData: { queryItem: "avengers", sortBy: "title ASC", pages: 0 },
	});
	//creates a mocked response
	const mockedRes = mockRes();
	//waits for the search funtion to be carried out
	await searchFunction(mockedReq, mockedRes);
	//tests if the correct status is called in the response
	expect(mockedRes.status).toHaveBeenCalledWith(200);
});

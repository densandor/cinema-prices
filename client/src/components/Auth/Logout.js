import Axios from "axios";

const Logout = async () => {
	try {
		//sends a request to log the user out
		const response = await Axios.get("http://localhost:3001/logout", {
			withCredentials: true,
		});
		console.log(response);
	} catch (err) {
		console.log(err);
	}
};
export default Logout;

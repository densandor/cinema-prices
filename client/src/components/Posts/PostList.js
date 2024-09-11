import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
//uses the reusable CSS file
import "../../pages.css";
//imports components from the UI library
import { Stack, Text, Heading, Button } from "@chakra-ui/react";
//imports the context to be able to access user details
import UserContext from "../../context/UserContext";
//imports delete icon
import { FaTrash } from "react-icons/fa";

function PostList() {
	//gets the user details from the site context
	const { user } = useContext(UserContext);

	//presets the posts array to be empty
	const [posts, setPosts] = useState([]);

	// function is called when the page loads
	useEffect(() => {
		//function that gets all posts for a movie
		const getPosts = async () => {
			//sends request with movie id for reviws
			const response = await Axios.get("http://localhost:3001/posts");
			//iterates over the post in the response
			for (let i = 0; i < response.data.postsArr.length; i++) {
				let currentResult = response.data.postsArr[i];
				//adds the other posts to the list of posts
				setPosts((current) => [...current, currentResult]);
			}
		};
		getPosts();
	}, []);

	const deletePost = async (id) => {
		try {
			//sends a request to delete the review in the backend
			await Axios.delete("http://localhost:3001/posts", {
				data: { post_id: id },
			});
		} catch (err) {
			//handling error code
			if (!err?.response) {
				console.log("No Server Response");
			} else if (err.response?.status === 400) {
				console.log("Can't delete this post");
			} else {
				console.log("Something went wrong");
			}
		}
	};

	return (
		<>
			{posts.map((item, index) => (
				<>
					<Stack p="4" boxShadow="lg" m="4" borderRadius="sm" key={index}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						>
							<Heading size="md">{item.post_title}</Heading>
						</Stack>
						<Stack
							direction={{ base: "column", md: "row" }}
							justifyContent="left"
						>
							<Text
								fontSize={{ base: "sm" }}
								color="var(--accent)"
								textAlign={"left"}
								maxW={"4xl"}
							>
								{item.post_date.split("T")[0].split("-").reverse().join("/")}
							</Text>
							<Text
								fontSize={{ base: "sm" }}
								color="var(--accent)"
								textAlign={"left"}
								maxW={"4xl"}
							>
								{item.username}
							</Text>
						</Stack>
						<Stack
							direction={{ base: "column", md: "row" }}
							justifyContent="space-between"
						>
							<Text
								fontSize={{ base: "sm" }}
								color="var(--dark)"
								textAlign={"left"}
								maxW={"4xl"}
							>
								{item.post_content}
							</Text>
							{user.role == "admin" && (
								<Button
									onClick={() => deletePost(item.post_id)}
									w="fit-content"
								>
									<FaTrash />
								</Button>
							)}
						</Stack>
					</Stack>
				</>
			))}
		</>
	);
}

export default PostList;

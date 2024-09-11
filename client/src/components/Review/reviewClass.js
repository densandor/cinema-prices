//imports the star rating component
import { Rating } from "react-simple-star-rating";
//imports components from the UI library
import { Stack, Text, Heading } from "@chakra-ui/react";

class Review {
	//private attributes
	#movie_id;
	#user_id;
	#review_title;
	#review_content;
	#score;
	#date;
	#username;
	constructor(id, user, title, content, rating, date, username) {
		this.#movie_id = id;
		this.#user_id = user;
		this.#review_title = title;
		this.#review_content = content;
		this.#score = rating;
		this.#date = date;
		this.#username = username;
	}
	//pubic getters and setters
	get user_id() {
		return this.#user_id;
	}
	get title() {
		return this.#review_title;
	}
	get content() {
		return this.#review_content;
	}
	get score() {
		return this.#score;
	}
	get date() {
		return this.#date.split("T")[0];
	}
	get username() {
		return this.#username;
	}

	//public method which returns HTML which displays the review
	displayReview() {
		return (
			<>
				<Stack p="4" boxShadow="lg" m="4" borderRadius="sm">
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Heading size="md">{this.#review_title}</Heading>
						<Stack direction={{ base: "column", md: "row" }}>
							<Rating initialValue={this.#score} readonly={true} />
						</Stack>
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
							{this.#date.split("T")[0].split("-").reverse().join("/")}
						</Text>
						<Text
							fontSize={{ base: "sm" }}
							color="var(--accent)"
							textAlign={"left"}
							maxW={"4xl"}
						>
							{this.#username}
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
							{this.#review_content}
						</Text>
					</Stack>
				</Stack>
			</>
		);
	}
}

export default Review;

//imports components from the UI library
import {
	Card,
	CardBody,
	CardFooter,
	Stack,
	Text,
	Image,
	Button,
	Heading,
} from "@chakra-ui/react";

class Movie {
	//private attributes
	#movie_id;
	#title;
	#runtime;
	#release_date;
	#overview;
	#budget;
	#revenue;
	#rating;
	#poster_path;
	#genres;
	constructor(
		id,
		movieTitle,
		time,
		release,
		description,
		bud,
		rev,
		score,
		poster,
		genreList
	) {
		this.#movie_id = id;
		this.#title = movieTitle;
		this.#runtime = time;
		this.#release_date = release;
		this.#overview = description;
		this.#budget = bud;
		this.#revenue = rev;
		this.#rating = score;
		this.#poster_path = poster;
		this.#genres = genreList;
	}
	//public getters and setters
	get movie_id() {
		return this.#movie_id;
	}
	get title() {
		return this.#title;
	}
	get runtime() {
		return this.#runtime;
	}
	get release_date() {
		return this.#release_date;
	}
	get overview() {
		return this.#overview;
	}
	get budget() {
		return this.#budget;
	}
	get revenue() {
		return this.#revenue;
	}
	get rating() {
		return this.#rating;
	}
	get poster_path() {
		return this.#poster_path;
	}
	get genres() {
		return this.#genres;
	}

	//public method to display the movie in search results by returning HTML
	displayMovie() {
		return (
			<>
				<Card
					direction={{ base: "column", sm: "row" }}
					overflow="hidden"
					variant="elevated"
					w={{ base: "80%", sm: "960px" }}
					margin={{ base: "1rem" }}
				>
					<Image
						objectFit="cover"
						maxW={{ base: "100%", sm: "200px" }}
						src={"https://image.tmdb.org/t/p/w1280" + this.#poster_path}
						alt="Movie poster"
					/>

					<Stack>
						<CardBody>
							<Heading size="md">{this.#title}</Heading>

							<Text py="2">{this.#overview}</Text>
						</CardBody>
						<CardFooter>
							<Button variant="solid" colorScheme="blue">
								Check the prices
							</Button>
						</CardFooter>
					</Stack>
				</Card>
			</>
		);
	}
}
export default Movie;

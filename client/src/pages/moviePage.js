import Axios from "axios";
import React, { useEffect, useState } from "react";
//imports function to get items from the URL from the site navigation library
import { useParams } from "react-router-dom";
//imports the movie class to be able to create movie objects
import Movie from "../components/Movie/movieClass";
//imports the reviewlist component to display reviews
import ReviewList from "../components/Review/ReviewList";
//imports the showtimes component
import Showtimes from "../components/Movie/Showtimes";
//uses the reusable css file
import "../pages.css";
//imports components from the UI library
import {
	Box,
	Container,
	Stack,
	Text,
	Image,
	Flex,
	VStack,
	Heading,
	SimpleGrid,
	StackDivider,
	List,
	ListItem,
	Divider,
} from "@chakra-ui/react";
//imports the star rating component for the movie's rating
import { Rating } from "react-simple-star-rating";

function MoviePage() {
	//gets the movie id from the link
	const { id } = useParams();

	//presets the movie displayed
	const [item, setItem] = useState(null);
	//presets the array of showtimes for the movie
	const [showtimes, setShowtimes] = useState([]);
	//presets the genres of the movie
	const [genres, setGenres] = useState([]);

	//function called when the id from the link changes (when page loads)
	useEffect(() => {
		const getMovie = async () => {
			//sends a request with the id of the movie
			const response = await Axios.get("http://localhost:3001/movieDetails", {
				params: { id: id },
			});
			//gets the details of the movie from the response
			const movieDetails = response.data.movie;
			//creates a movie object from the result
			const movieObject = new Movie(...Object.values(movieDetails));
			console.log(movieObject);
			//sets state to be the movie object
			setItem(movieObject);
			//gets the showtimes from the response
			const showings = response.data.showtimes;
			//sets the showtimes of the movie
			setShowtimes(showings);
		};
		getMovie();
	}, [id]);

	//function called when the movie item is preset
	useEffect(() => {
		const getGenres = async () => {
			//gets all the possible genre options
			const response = await Axios.get("http://localhost:3001/genres");
			//creates a list of genres each with their name and id
			const allGenres = response.data.genres.map((genre) => ({
				label: genre.genre_name,
				value: genre.genre_id,
			}));

			//gets the genres which the movie has
			let genreNames = allGenres.filter((obj) =>
				item?.genres.includes(obj.value)
			);
			//gets the names of the genres that the movie has
			genreNames = genreNames.map((obj) => obj.label);
			//sets the genre list to be the names
			setGenres(genreNames);
		};

		getGenres();
	}, [item]);

	return (
		<>
			{item && (
				<div className="content">
					<Container maxW={"7xl"}>
						<SimpleGrid
							columns={{ base: 1, lg: 2 }}
							spacing={{ base: 8, md: 10 }}
							py={{ base: 18, md: 24 }}
						>
							<Flex
								align="flex-start"
								alignItems="flex-start"
								verticalAlign="top"
							>
								<Image
									rounded={"md"}
									alt={"product image"}
									src={"https://image.tmdb.org/t/p/w1280" + item.poster_path}
									width={"100%"}
									objectFit={"contain"}
								/>
							</Flex>
							<Stack spacing={{ base: 6, md: 10 }}>
								<Box as={"header"}>
									<Heading
										lineHeight={1.1}
										fontWeight={600}
										fontSize={{
											base: "2xl",
											sm: "4xl",
											lg: "5xl",
										}}
									>
										{item.title}
									</Heading>
								</Box>
								<Rating
									allowHover={false}
									initialValue={item.rating}
									readonly={true}
									allowFraction={true}
								/>
								<Stack
									spacing={{ base: 4, sm: 6 }}
									direction={"column"}
									divider={<StackDivider borderColor={"var(--dark)"} />}
								>
									<VStack spacing={{ base: 4, sm: 6 }}>
										<Text fontSize={"lg"}>{item.overview}</Text>
									</VStack>
									<Box>
										<Text
											fontSize={{ base: "16px", lg: "18px" }}
											color={"var(--dark)"}
											fontWeight={"500"}
											textTransform={"uppercase"}
											mb={"4"}
										>
											Genres
										</Text>
										<SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
											<List spacing={2}>
												{genres &&
													genres.map((name, i) => (
														<ListItem key={i}>{name}</ListItem>
													))}
											</List>
										</SimpleGrid>
									</Box>
									<Box>
										<Text
											fontSize={{ base: "16px", lg: "18px" }}
											color={"var(--blue)"}
											fontWeight={"500"}
											textTransform={"uppercase"}
											mb={"4"}
										>
											Movie Details
										</Text>

										<List spacing={2}>
											<ListItem>
												<Text as={"span"} fontWeight={"bold"}>
													Release Date:
												</Text>{" "}
												{new Date(item.release_date).toLocaleString("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</ListItem>
											<ListItem>
												<Text as={"span"} fontWeight={"bold"}>
													Duration:
												</Text>{" "}
												{item.runtime} minutes
											</ListItem>
											<ListItem>
												<Text as={"span"} fontWeight={"bold"}>
													Budget:
												</Text>
												{" $"}
												{item.budget}
											</ListItem>
											<ListItem>
												<Text as={"span"} fontWeight={"bold"}>
													Revenue:
												</Text>
												{" $"}
												{item.revenue}
											</ListItem>
										</List>
									</Box>
									<Box>
										<Text
											fontSize={{ base: "16px", lg: "18px" }}
											color={"var(--blue)"}
											fontWeight={"500"}
											textTransform={"uppercase"}
											mb={"4"}
										>
											Showtimes
										</Text>
										<Showtimes showtimes={showtimes} />
									</Box>
								</Stack>
							</Stack>
						</SimpleGrid>
					</Container>
					<Flex
						align="center"
						justifyContent={"center"}
						margin="0 10%"
						width="100%"
					>
						<Text padding={2}>Reviews</Text>
						<Divider borderColor={"var(--dark)"} width={"80%"} />
					</Flex>
					<div className="reviews">
						<ReviewList movie_id={id} />
					</div>
				</div>
			)}
		</>
	);
}

export default MoviePage;

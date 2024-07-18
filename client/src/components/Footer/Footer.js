//imports components from UI library
import { Box, Container, Stack, Text } from "@chakra-ui/react";
//imports links from site navigation library
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<Box bg={"var(--light)"} color={"var(--dark)"}>
			<Container
				as={Stack}
				maxW={"6xl"}
				py={4}
				direction={{ base: "column", md: "row" }}
				spacing={4}
				justify={{ base: "center", md: "space-between" }}
				align={{ base: "center", md: "center" }}
			>
				<Stack direction={"row"} spacing={6}>
					<Link to="/">Home</Link>
					<Link to="/about">About</Link>
					<Link to="/search">Movie Search</Link>
					<Link to="/login">Sign in</Link>
				</Stack>
				<Text>© 2023 CinemaPrices</Text>
			</Container>
		</Box>
	);
};

export default Footer;

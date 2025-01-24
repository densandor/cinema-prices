import React, { useEffect, useState } from "react";
//import dropdown from library
import Select from "react-select";
//import components from UI library
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Box,
	Heading,
	Text,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

const Showtimes = (props) => {
	//get the showtimes passed to the component
	const showtimesByDate = props.showtimes;
	//preset the date options for the dropdown as an empty array
	const [options, setOptions] = useState([]);
	//preset the selected date to empty
	const [date, setDate] = useState("");

	//function to get the date options for the showtimes (runs on page load)
	useEffect(() => {
		//checks if there are any date options
		if (Object.keys(showtimesByDate).length > 0) {
			//creates an array with the date options
			let arr = Object.keys(showtimesByDate).map((key) => ({
				label: key,
				value: key,
			}));
			//sets the dropdown options as the date options
			setOptions(arr);
			//sets the selected option to be the first one
			setDate(arr[0].value);
		}
	}, []);

	//changes the selected date
	const handleDateChange = (e) => {
		setDate(e.value);
	};

	return (
		<>
			{showtimesByDate[date] ? (
				<>
					<Select
						options={options}
						onChange={handleDateChange}
						value={options.filter((obj) => date === obj.value)}
						placeholder="Select Date"
					/>
					<Box overflowY="auto" maxHeight="300px">
						<TableContainer>
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th>Cinema</Th>
										<Th>Time</Th>
										<Th>Price</Th>
									</Tr>
								</Thead>
								<Tbody>
									{showtimesByDate[date] &&
										showtimesByDate[date].map((showing, i) => {
											return (
												<Tr key={i}>
													<Td>{showing.cinema}</Td>
													<Td>
														{new Date(showing.show_date).getHours()}:
														{(
															"0" + new Date(showing.show_date).getMinutes()
														).slice(-2)}
													</Td>
													<a href={showing.link}>
														<Td className="booking-link">
															{showing.price != 0
																? "£" + showing.price
																: "Price not found"}
														</Td>
													</a>
												</Tr>
											);
										})}
								</Tbody>
							</Table>
						</TableContainer>
					</Box>
				</>
			) : (
				<Box textAlign="center" py={10} px={6}>
					<WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
					<Heading as="h2" size="xl" mt={6} mb={2}>
						No showtimes found
					</Heading>
					<Text color={"gray.500"}>
						This movie is not currenly being shown in cinemas
					</Text>
				</Box>
			)}
		</>
	);
};

export default Showtimes;

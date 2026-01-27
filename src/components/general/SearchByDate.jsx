import { useState } from "react";
import { 
	Box, 
	Button, 
	Field, 
	Input, 
	Stack, 
	NativeSelect 
} from "@chakra-ui/react";

const SearchByDate = props => {
	let { 
		handleSubmit 
	} = props;

	const [st_dateType, sst_dateType] = useState("dateTaken");
	const [st_startDate, sst_startDate] = useState("");
	const [st_endDate, sst_endDate] = useState("");

	const onSubmit = event=>{
		event.preventDefault();
		
		handleSubmit( st_dateType, st_startDate, st_endDate );
	}; // onSubmit

	return (
		<Box 
			as="form" 
			onSubmit={onSubmit} 
			p="4" 
			borderWidth="1px" 
			borderRadius="lg" 
			mb="6"
			bg="bg.subtle"
		>
			<Stack gap="4" direction={{ base: "column", md: "row" }} align="flex-end">
				
				<Field.Root maxW="200px">
					<Field.Label>Search By</Field.Label>
					<NativeSelect.Root>
						<NativeSelect.Field 
							value={st_dateType} 
							onChange={(event) => sst_dateType(event.target.value)}
						>
							<option value="dateTaken">Date Taken</option>
							<option value="dateAdded">Date Added</option>
						</NativeSelect.Field>
					</NativeSelect.Root>
				</Field.Root>

				<Field.Root>
					<Field.Label>Start Date</Field.Label>
					<Input 
						type="date" 
						value={st_startDate} 
						onChange={(event) => sst_startDate(event.target.value)} 
					/>
				</Field.Root>

				<Field.Root>
					<Field.Label>End Date</Field.Label>
					<Input 
						type="date" 
						value={st_endDate} 
						onChange={(event) => sst_endDate(event.target.value)} 
					/>
				</Field.Root>

				<Button type="submit" colorScheme="teal" px="8">
					Search
				</Button>

			</Stack>
		</Box>
	);
};

export default SearchByDate;
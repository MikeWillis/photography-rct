import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
	Stack,
	Box,
	Flex,
	Input,
} from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { FaFilter } from "react-icons/fa";

import GalleryLetterBox from "./GalleryLetterBox";
import DebouncedInput from "../form/DebouncedInput";

import { config } from "../../config";

import generalStyles from "../../styles/general.module.scss";
import styles from "../../styles/galleryList.module.scss";

const GalleryList = props => {
	let galleries = useSelector(state => state.galleries);

	const [st_filter, sst_filter] = useState(null);
	const [st_filteredList, sst_filteredList] = useState(null);
	const [st_fullList, sst_fullList] = useState(null);

	useEffect(() => {
		let fullList = [];
		galleries.galleryList.forEach(entry => {
			entry.list.forEach(gallery => {
				fullList.push(gallery);
			});
		});
		sst_fullList(fullList);
	},[
		galleries,
	]);

	// console.log("st_fullList", st_fullList);

	let handleFilter = useCallback(filter => {
		if ( filter ) {
			let filteredList = st_fullList.filter(entry => {
				// console.log("entry", entry);
				return entry.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
			});
			sst_filteredList(filteredList);
			sst_filter(filter);
		} else {
			sst_filteredList(null);
			sst_filter(null);
		}
	},[
		st_fullList,
	]);

	return (
		<Box className={`${generalStyles.content100vw}`}>

			<Box
				paddingLeft={config.contentIndent}
				paddingRight={config.contentIndent}
				paddingTop="2vh"
				paddingBottom="2vh"
			>
				<Box
					padding="2vh"
					backgroundColor="#fff"
					marginBottom="2vh"
					borderRadius={"{radii.lg}"}
				>
					<DebouncedInput
						placeholder="Type Here To Filter The Lists"
						endElement={<FaFilter />}
						onChange={handleFilter}
					/>
				</Box>

				{
					st_filteredList ? (
						<GalleryLetterBox letter={st_filter} list={st_filteredList} />
					) : (
						<Flex
							direction="row"
							gap="10"
							wrap="wrap"
							className={styles.letterList}
							borderRadius={"{radii.lg}"}
						>
							{
								galleries.galleryList.length ? (
									galleries.galleryList.map((entry) => {
										return (
											<GalleryLetterBox key={entry.letter} letter={entry.letter} list={entry.list} />
										);
									})
								) : ""
							}
						</Flex>
					)
				}

			</Box>
		</Box >
	);
};

export default GalleryList;
import {
	Stack,
	Box,
} from "@chakra-ui/react";

import Link from "../general/Link";

import styles from "../../styles/galleryList.module.scss";

const GalleryLetterBox = props => {
	return (
		<Box
			className={styles.letterBoxContainer}
			borderColor={"{colors.teal.solid}"}
			borderRadius={"{radii.lg}"}
		>
			<Box
				className={styles.letterBox}
			>
				<Box className={styles.letter} borderBottomColor={"{colors.teal.solid}"}>{props.letter}</Box>
				{
					props.list.map(entry => {
						var path = `/galleries/${entry}`;
						return (
							<p className={styles.animal} key={entry}>
								<Link
									variant="underline"
									to={path}
									text={entry}
								/>
							</p>
						);
					})
				}
			</Box>
		</Box>
	);
};

export default GalleryLetterBox;
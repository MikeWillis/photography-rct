import { Fragment, useState, useEffect } from "react";
import {
	Box,
	Link as ChakraLink,
	Text,
} from "@chakra-ui/react";

import { config } from "../../config";

import styles from "../../styles/imageGallery.module.scss";

const PhotoGallery_Thumbnail = props => {
	let {
		image,
		handleClick,
		index,
		hasPrevious,
		hasNext,
		login,
	} = props;

	let {
		thumbURL,
		fullURL,
	} = image;

	let [st_hovering, sst_hovering] = useState(false);

	let caption = `${image.AnimalCommon} - ${image.AnimalScientific}`;
	if (image.Notes) {
		caption = `${caption}; ${image.Notes}`;
	}

	return (
		<ChakraLink
			href={fullURL}
			onClick={event => handleClick(event, index)}
			position="relative"
			variant="underline"
			onMouseEnter={event => sst_hovering(true)}
			onMouseLeave={event => sst_hovering(false)}
			data-pswp-width={image.fullWidth}
			data-pswp-height={image.fullHeight}
		>
			<Box
				borderColor={"{colors.teal.solid}"}
				borderRadius={"{radii.lg}"}
				borderWidth="1px"
				overflow="hidden"
				padding="0"
				margin="0"
			>
				<img
					src={thumbURL}
					height={image.ThumbHeight}
					width={image.ThumbWidth}
					loading="lazy"
				/>
				{
					st_hovering ? (
						<Box className={styles.thumbDetails}>
							<Text>
								<span className={styles.animalCommon}>{image.AnimalCommon}</span>
								{
									image.threatCategory ? (
										<Fragment>
											<br />IUCN Threat Level: {image.threatCategory}
										</Fragment>
									) : ""
								}
								{/* <br />Image ID #{image.ImageID} */}
								{/* <br />{image.DateTaken_Formatted} */}
								<br />{image.location ? `${image.location}, ` : ""}{image.country}
							</Text>
						</Box>
					) : ""
				}
			</Box>

		</ChakraLink>
	);
};

export default PhotoGallery_Thumbnail;
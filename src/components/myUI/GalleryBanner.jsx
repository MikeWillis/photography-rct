import { Heading } from "@chakra-ui/react";

import { config } from "../../config";

import styles from "../../styles/imageGallery.module.scss";

const GalleryBanner = (props) => {
	return (
		<div className={styles.galleryBanner}>
			<Heading
				size="3xl"
				color={`${config.colorPalette}.fg`}
				textAlign={"center"}
				as="h2"
			>
				{props.text}
			</Heading>
		</div>
	);
};

export default GalleryBanner;
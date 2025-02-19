import { Fragment } from "react";
import {
	Box,
} from "@chakra-ui/react";

import PhotoGallery_Thumbnail from "./PhotoGallery_Thumbnail";

import { config } from "../../config";

const PhotoGallery_Thumbnails = props => {
	let {
		images,
		type,
	} = props;

	let handleClick = (event)=>{
		event.preventDefault();
	}; // handleClick

	return images.map((image, index) => {
		// console.log("image", image);
		let imagePath = image.FilePath.replace("/images/", "/");
		let thumbPath = imagePath.replace("1500", "300");
		let thumbURL = `https://${config.imagesDomain}${thumbPath}${image.FileName}`;
		let fullURL = `https://${config.imagesDomain}${imagePath}${image.FileName}`;

		return (
			<a
				href={fullURL}
			>
				<img
					src={thumbURL}
				/>
				<br /><span className="animalCommon">{Image.AnimalCommon}</span>
				<br />Image ID #{Image.ImageID}
				<br />{Image.DateTaken_Formatted}
				<br />{Image.location}, {Image.country}
			</a>
		)
	});
};

export default PhotoGallery_Thumbnails;
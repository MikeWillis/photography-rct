import { Fragment, useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { FaChevronCircleRight, FaChevronCircleLeft } from "react-icons/fa";
import { default as MasonryCSS } from "react-masonry-css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import {
	Box,
	Center,
	AbsoluteCenter,
	Flex,
	Text,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "../ui/dialog";

import { fetchGallery } from "../../redux/slices/galleries";

import GalleryBanner from "./GalleryBanner";
import PhotoGallery_Thumbnail from "./PhotoGallery_Thumbnail";

import { config } from "../../config";
import { getAllCSSVariableNames } from "../../util";

import styles from "../../styles/imageGallery.module.scss";
import generalStyles from "../../styles/general.module.scss";
import masonryStyles from "../../styles/masonry.module.scss";

const MasonryCSSBreakpoints = {
	default: 4,
	2000: 5,
	1700: 4,
	1300: 3,
	1000: 2,
	600: 1
};

const ResponsiveMasonryBreakpoints = {
	// format for columns is width: columnCount
	columns: {
		200: 1,
		750: 2,
		900: 3,
		1200: 4,
	},
	// format for gutters is width: gutterWidth
	gutters: {
		200: "10px",
		750: "10px",
		900: "10px",
		1200: "10px",
	},
};

const PhotoGallery = props => {
	let {
		galleryType,
	} = props;

	const dispatch = useDispatch();

	const [st_dialogOpen, sst_dialogOpen] = useState(false);
	const [st_focusedImage, sst_focusedImage] = useState(false);
	const [st_sort, sst_sort] = useState("random");
	const [st_sortedGallery, sst_sortedGallery] = useState([]);

	let galleries = useSelector(state => state.galleries);

	useEffect(() => {
		let gallery = galleries.galleries.filter(gal => gal.type === galleryType);
		let adminToken = localStorage.getItem('adminToken');
		if (!gallery.length) {
			// console.log("calling fetchGallery");
			dispatch(fetchGallery({
				galleryType: galleryType,
				adminToken: adminToken,
			}));
		} else {
			// yay
			gallery = gallery[0];

			let sortBy;
			switch (st_sort) {
				case "random":
					sortBy = "randomID";
					break;
				case "date":
					sortBy = "dateTakenEpoch";
					break;
				case "country":
					sortBy = "country";
					break;
				default:
				// stop annoying me
			}
			sst_sortedGallery(_.sortBy(gallery.images, [sortBy]));
		}
	}, [
		galleries,
		galleryType,
		st_sort,
	]);

	let handleMouseHover = event => {

	}; // handleMouseHover

	let handleGalleryNavigateClick = (event, direction) => {
		event.preventDefault();
		if ( direction === "backward" && st_focusedImage.index > 0 ) {
			setFocusedImage(st_focusedImage.index - 1);
		} else if ( direction === "forward" && st_focusedImage.index < st_sortedGallery.length - 1 ) {
			setFocusedImage(st_focusedImage.index + 1);
		}
	}; // handleGalleryNavigateClick

	let setFocusedImage = (index, event = false) => {
		if (index === false) {
			sst_dialogOpen(false);
			sst_focusedImage(false);
		} else {
			if (event) {
				event.preventDefault();
			}
			let image = st_sortedGallery[index];
			let imagePath = image.FilePath.replace("/images/", "/");
			let fullURL = `https://${config.imagesDomain}${imagePath}${image.FileName}`;

			// console.log("image", image);

			sst_focusedImage({
				...image,
				index: index,
				fullURL: fullURL
			});
			sst_dialogOpen(true);
		}
	}; // setFocusedImage

	let renderPhotoDetails = () => {
		if (!st_focusedImage) {
			return "";
		} else {
			let photoData = JSON.parse(st_focusedImage.PhotoData);
			return (
				<Text className={styles.photoData}>
					{photoData.Camera ? `${photoData.Camera} | ` : ""}
					{photoData.Aperture ? `${photoData.Aperture} | ` : ""}
					{photoData.ShutterSpeed ? `${photoData.ShutterSpeed} | ` : ""}
					{photoData.ISO ? `ISO ${photoData.ISO} | ` : ""}
					{photoData.FocalLength ? `Focal Length ${photoData.FocalLength}` : ""}
				</Text>
			);
		}
	}; // renderPhotoDetails

	/* 2025-02-12: I'd love to make this function into its own component,
	* but the masonry plugin doesn't like having ANYTHING other than a direct div
	* or an image etc as the first child element
	*/
	const renderThumbBoxes = useCallback(images => {
		return images.map((image, index) => {
			return (
				<Box
					className={styles.thumbContainer}
					key={`galleryThumb_${image.ImageID}_${index}`}
					onMouseEnter={() => handleMouseHover(image.ImageID)}
					onMouseLeave={() => handleMouseHover()}
				>
					<PhotoGallery_Thumbnail
						image={image}
						index={index}
						handleClick={setFocusedImage}
					/>
				</Box>
			);
		})
	}, [
		handleMouseHover,
	]);

	let bannerText;
	let pageTitle;

	switch (galleryType) {
		case "Trip":
			bannerText = match.params.trip.replace("_", " ");
			pageTitle = `Trip: ${bannerText} | Michael Willis Photography`;
			break;
		case "Animal":
			bannerText = match.params.Animal;
			if (bannerText === "newest") { bannerText = "Newest"; }
			pageTitle = `${bannerText} Photo Gallery | Michael Willis Photography`;
			break;
		case "Random":
			bannerText = "Some Random Photos";
			break;
	}

	return (
		<Box
			className={`${generalStyles.content} ${generalStyles.content100vw} ${styles.galleryContainer}`}
		>
			<GalleryBanner text={bannerText} />
			<Box
				paddingLeft={config.contentIndent}
				paddingRight={config.contentIndent}
				paddingTop="10px"
			>
				{
					st_sortedGallery.length ? (
						<ResponsiveMasonry
							columnsCountBreakPoints={ResponsiveMasonryBreakpoints.columns}
							gutterBreakpoints={ResponsiveMasonryBreakpoints.gutter}
						>
							<Masonry>
								{renderThumbBoxes(st_sortedGallery)}
							</Masonry>
						</ResponsiveMasonry>
					) : ""
				}
			</Box>

			<DialogRoot
				lazyMount
				open={st_dialogOpen}
				onOpenChange={(e) => sst_dialogOpen(e.open)}
				size="cover"
				placement="center"
				motionPreset="slide-in-bottom"
			>
				<DialogContent>
					<DialogHeader
						className={styles.dialogHeader}
						borderBottomColor={"{colors.border}"}
					>
						<DialogTitle className={styles.animalCommon}>
							{`${st_focusedImage.AnimalCommon} | ${st_focusedImage.DateTaken_Formatted} | ${(st_focusedImage.location ? `${st_focusedImage.location}, ` : "")}${st_focusedImage.country}`}
						</DialogTitle>
					</DialogHeader>
					<DialogBody className={styles.dialogBody} height="91%">
						<Flex
							direction="row"
							wrap="nowrap"
							justifyContent="space-between"
							alignItems="stretch"
							height="100%"
						>
							<Center
								className={styles.galleryNavigate}
								cursor={st_focusedImage.index > 0 ? "pointer" : "default"}
								onClick={event => handleGalleryNavigateClick(event, "backward")}
							>
								<Text color={"{colors.teal.solid}"}>
									<FaChevronCircleLeft
										size="3em"
										visibility={st_focusedImage.index > 0 ? "visible" : "hidden"}
									/>
								</Text>
							</Center>
							<Box overflow="auto" flex="1">
								<Center className={styles.imageContainer}>
									<img
										src={st_focusedImage.fullURL}
										alt={`${st_focusedImage.AnimalCommon}`}
									/>
								</Center>
							</Box>
							<Center
								className={styles.galleryNavigate}
								cursor={st_focusedImage.index < st_sortedGallery.length - 1 ? "pointer" : "default"}
								onClick={event => handleGalleryNavigateClick(event, "forward")}
							>
								<Text color={"{colors.teal.solid}"}>
									<FaChevronCircleRight
										size="3em"
										visibility={st_focusedImage.index < st_sortedGallery.length - 1 ? "visible" : "hidden"}
									/>
								</Text>
							</Center>
						</Flex>

					</DialogBody>
					<DialogFooter
						className={styles.dialogFooter}
						borderTopColor={"{colors.border}"}
					>
						{renderPhotoDetails()}
					</DialogFooter>
					<DialogCloseTrigger
						height="20px"
						padding="3px"
						margin="0"
					/>
				</DialogContent>
			</DialogRoot>
		</Box>
	)
};

export default PhotoGallery;
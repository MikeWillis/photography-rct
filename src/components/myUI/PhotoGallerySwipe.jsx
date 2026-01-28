import { Fragment, memo, useState, useEffect, useCallback, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from "photoswipe";
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin";
import { FaGear, FaMagnifyingGlass } from "react-icons/fa6"

import {
	Box,
	Center,
	AbsoluteCenter,
	Flex,
	Text,
	Grid,
	GridItem,
	IconButton,
	Alert,
	Link,
	Wrap,
	WrapItem,

	createListCollection,
} from "@chakra-ui/react";
import {
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from "../ui/select";

import BlurbLink from "../general/BlurbLink";
import GalleryBanner from "./GalleryBanner";
import PhotoGallery_Thumbnail from "./PhotoGallery_Thumbnail";
import AdminTools from "../general/AdminTools";

import { selectConservationLinks } from "../../redux/slices/navigation";
import { fetchGallery } from "../../redux/slices/galleries";
import { shuffleArray } from "../../util";
import { config } from "../../config";

import styles from "../../styles/imageGallery.module.scss";
import generalStyles from "../../styles/general.module.scss";
import 'photoswipe/style.css';
import "photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css";

let lightbox;

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

const GalleryItem = memo(({ image, index, isAdmin, onAdminClick, onThumbClick }) => {
	// console.log("image",image);

	if (isAdmin) {
		// console.log(`Image ${image.ImageID} Visibility: ${image.Visibility}`);
	}

	let itemStyles = {};
	if (isAdmin) {
		itemStyles.border = "1px solid green";
		itemStyles.padding = "4px";
		if (!image.Visible) {
			itemStyles.backgroundColor = "#FCA5A5";
		} else {
			switch( image.Visibility ) {
				case "admin": {
					itemStyles.backgroundColor = "#FDE68A";
					break;
				}
				case "trip": {
					itemStyles.backgroundColor = "#E0F2FE";
					break;
				}
			}
		}
	}

	return (
		<Box
			className={styles.thumbContainer}
			data-imageid={image.ImageID}
			style={itemStyles}
		>
			{
				isAdmin ? (
					<Fragment>
						<IconButton
							aria-label="Admin Tools"
							size="xs"
							variant="subtle"
							colorPalette="gray"
							onClick={(e) => {
								e.stopPropagation();
								onAdminClick(image);
							}}
						>
							<FaGear />
						</IconButton>
						{/* {image.Visibility} */}
					</Fragment>
				) : ""
			}
			<PhotoGallery_Thumbnail
				image={image}
				index={index}
				handleClick={onThumbClick}
			/>
		</Box>
	);
});

GalleryItem.displayName = 'GalleryItem';

const NoResultsMessage = props => {
	let {
		message = "No images found for that specific date range."
	} = props;

	return (
		<Alert.Root status="info" variant="subtle" borderRadius="lg" py="6">
			<Alert.Indicator>
				<FaMagnifyingGlass />
			</Alert.Indicator>
			<Alert.Content>
				<Alert.Title>No Results</Alert.Title>
				<Alert.Description>
					<Text color="fg.muted">
						{message} Try adjusting your search or checking a different date type.
					</Text>
				</Alert.Description>
			</Alert.Content>
		</Alert.Root>
	);
}; // NoResultsMessage

NoResultsMessage.displayName = "NoResultsMessage";

const PhotoGallerySwipe = memo(props => {
	let {
		galleryType,
	} = props;

	const dispatch = useDispatch();
	const ref_gallery = useRef();

	const isAdmin = useSelector((state) => state.auth.isAdmin);
	const conservationLinks = useSelector( selectConservationLinks );
	let galleries = useSelector(state => state.galleries);

	let sortOptionItems = [
		{ value: "random", label: "Random" },
		{ value: "date", label: "Date Taken" }
	];
	if (galleryType !== "Trip") {
		sortOptionItems.push({ value: "country", label: "Country Taken" });
	}

	// console.log("galleryType",galleryType);

	const sortOptions = createListCollection({
		items: sortOptionItems,
	});

	const [st_activeAdminImage, sst_activeAdminImage] = useState(null);
	const [st_sort,sst_sort] = useState(()=>{
		return galleryType === "newest" ? "date" : "random";
	});
	const [st_sortDirection,sst_sortDirection] = useState(()=>{
		return galleryType === "newest" ? "DESC" : "ASC";
	});
	const [st_gallery,sst_gallery] = useState([]);
	const [st_sortedGallery, sst_sortedGallery] = useState([]);

	useEffect(() => {
		if (!galleries.loading) {
			console.log("galleries",galleries);
			const targetGallery = galleries.galleries.find(gal => gal.type === galleryType);
			console.log("targetGallery",targetGallery);
			if (targetGallery) {
				const processedGallery = targetGallery.images.map((image, index) => {
					// 1. Check if we already have this image in our local state to steal its processed data
					const existing = st_gallery.find(img => img.ImageID === image.ImageID);

					// 2. REFERENCE CHECK: If the object in Redux is the EXACT same one as before,
					// return the existing version. This is the secret to zero-lag.
					if (existing && existing === image) {
						return existing;
					}

					// 3. Otherwise, something changed (or it's the first load). Process it:
					const imagePath = image.FilePath.replace("/images/", "/");
					const thumbPath = imagePath.replace("1500", "300");

					// console.log("image",image);
					return {
						...image,
						randomSortVal: existing?.randomSortVal ?? Math.random(),
						index,
						caption: `${image.AnimalCommon} - ${image.AnimalScientific}${image.Notes ? `; ${image.Notes}` : ""}`,
						thumbURL: `https://${config.imagesDomain}${thumbPath}${image.FileName}`,
						fullURL: `https://${config.imagesDomain}${imagePath}${image.FileName}`,
						src: `https://${config.imagesDomain}${imagePath}${image.FileName}`
					};
				});

				// Only update local state if the resulting array is actually different
				sst_gallery(prev => {
					if (_.isEqual(prev, processedGallery)) return prev;
					return processedGallery;
				});
			}
		}
	}, [galleryType, galleries,st_gallery]); // Removed st_gallery from here to prevent infinite loops

	useEffect(() => {
		let sortBy;
		switch (st_sort) {
		case "date":
			sortBy = "dateTakenEpoch";
			break;
		case "country":
			sortBy = "country";
			break;
		case "random":
		default:
			sortBy = "randomSortVal";
			break;
		}

		let gall = _.sortBy(st_gallery, [sortBy]);
		if ( st_sortDirection === "DESC" ) {
			gall.reverse();
		}
		sst_sortedGallery( gall );
	}, [
		st_gallery,
		st_sort,
		st_sortDirection,
	]);

	useEffect(() => {
		lightbox = new PhotoSwipeLightbox({
			dataSource: st_sortedGallery,
			showHideAnimationType: 'zoom',
			pswpModule: PhotoSwipe,
		});

		lightbox.addFilter('thumbEl', (thumbEl, data, index) => {
			const el = ref_gallery.current.querySelector(`[data-imageid='${data.ImageID}'] img`);
			if (el) {
				return el;
			}
			return thumbEl;
		});

		lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
			const el = ref_gallery.current.querySelector(`[data-imageid='${slide.data.ImageID}'] img`);
			if (el) {
				return el.src;
			}
			return placeholderSrc;
		});

		const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
			type: 'below',
			captionContent: (slide) => {
				let photoData = JSON.parse(slide.data.PhotoData);
				let html = ReactDOMServer.renderToStaticMarkup(
					<div>
						<p>
							{`${slide.data.AnimalCommon} | ${slide.data.DateTaken_Formatted} | ${(slide.data.location ? `${slide.data.location}, ` : "")}${slide.data.country}`}
						</p>
						{
							slide.data.Notes ? (
								<p>{slide.data.Notes}</p>
							) : ""
						}
						<p style={{ fontStyle: "italic" }}>
							{photoData.Camera ? `${photoData.Camera} | ` : ""}
							{photoData.Aperture ? `${photoData.Aperture} | ` : ""}
							{photoData.ShutterSpeed ? `${photoData.ShutterSpeed} | ` : ""}
							{photoData.ISO ? `ISO ${photoData.ISO} | ` : ""}
							{photoData.FocalLength ? `Focal Length ${photoData.FocalLength}` : ""}
						</p>
					</div>
				);
				return html;
			}
		});

		lightbox.init();

		return () => {
			if (lightbox) {
				lightbox.destroy();
				lightbox = null;
			}
		};
	}, [
		st_sortedGallery
	]);

	const handleThumbClick = useCallback((event, index) => {
		event.preventDefault();
		if (lightbox) lightbox.loadAndOpen(index);
	}, []);

	const handleAdminClick = useCallback((image) => {
		sst_activeAdminImage(image);
	}, []);

	const renderThumbBoxes = useCallback((images) => {
		return images.map((image, index) => (
			<GalleryItem
				key={`galleryThumb_${image.ImageID}`} // Remove index from key if possible
				image={image}
				index={index}
				isAdmin={isAdmin}
				onAdminClick={handleAdminClick}
				onThumbClick={handleThumbClick}
			/>
		));
	}, [isAdmin, handleAdminClick, handleThumbClick]);

	let renderSortSelector = () => {
		return (
			<Fragment>
				<Box backgroundColor="#fff" padding="5px">
					<SelectRoot
						collection={sortOptions}
						size="sm"
						width="80%"
						marginRight="auto"
						marginLeft="auto"
						value={[st_sort]}
						onValueChange={event => {
							sst_sort(event.value[0]);
						}}
					>
						<SelectTrigger>
							<SelectValueText placeholder="Sort" />
						</SelectTrigger>
						<SelectContent>
							{
								sortOptions.items.map((sortOption) => {
									return (
										<SelectItem item={sortOption} key={sortOption.value}>
											{sortOption.label}
										</SelectItem>
									)
								})
							}
						</SelectContent>
					</SelectRoot>
				</Box>
			</Fragment>
		);
	}; // renderSortSelector

	return (
		<Box
			className={`${generalStyles.contentTransparent} ${generalStyles.content100vw} ${styles.galleryContainer}`}
		>
			{
				galleryType === "threatened" ? (
					<Box
						width="80%"
						marginLeft="auto"
						marginRight="auto"
						backgroundColor="#fff"
						padding="5px"
					>
						<Text>Below are a handful of photos I&apos;ve taken of animals that are currently classified as Threatened under the <Link href="https://www.iucnredlist.org/" target="_blank" rel="noopener noreferrer">IUCN redlist</Link>. The Threatened classification includes Vulnerable, Endangered, and Critically Endangered. I hope you like my photos, and more importantly, I hope you love animals. I hope these species can be preserved.</Text>

						<br />
						<Text>I used to think there was nothing I could to do help Threatened animals, being that many of them are so far away. But of course there is, and of course one of the most needed things is, you guessed it, money. Every little bit helps, so please consider donating.</Text>

						<Wrap
							className={styles.grids}
							paddingLeft={config.contentIndent}
							paddingRight={config.contentIndent}
							gap="20px"
							borderTop="1px solid #ccc"
							marginTop="10px"
							borderBottom="1px solid #ccc"
							marginBottom="10px"
							paddingTop="5px"
							paddingBottom="5px"
						>
							{
								conservationLinks.map((link,index)=>{
									return (
										<WrapItem
											key={`conservationLinks|${link.to}|${index}`}
											width={{ sm: "100%", md: "23%" }}
											padding="3px"
										>
											<BlurbLink
												variant="underline"
												to={link.to}
												text={link.text}
												blurb={link.blurb}
												image={link.image}
											/>
										</WrapItem>
									)
								})
							}
						</Wrap>
					</Box>
				) : ""
			}
			<div style={{ margin: "10px" }}>
				{renderSortSelector()}
			</div>
			<Box
				paddingLeft={config.contentIndent}
				paddingRight={config.contentIndent}
				paddingTop="10px"
				ref={ref_gallery}
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
					) : (
						<NoResultsMessage />
					)
				}
				

			</Box>

			{
				isAdmin && (
					<AdminTools 
						image={st_activeAdminImage} 
						onClose={() =>{
							// console.log("closing");
							sst_activeAdminImage(null);
						}} 
					/>
				)
			}
		</Box>
	);
});

PhotoGallerySwipe.displayName = 'PhotoGallerySwipe';

export default PhotoGallerySwipe;
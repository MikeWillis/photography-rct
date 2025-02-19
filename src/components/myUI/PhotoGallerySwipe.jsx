import { Fragment, memo, useState, useEffect, useCallback, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from "photoswipe";
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin";

import {
	Box,
	Center,
	AbsoluteCenter,
	Flex,
	Text,
	Grid,
	GridItem,
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

import GalleryBanner from "./GalleryBanner";
import PhotoGallery_Thumbnail from "./PhotoGallery_Thumbnail";

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

const PhotoGallerySwipe = memo(props => {
	let {
		galleryType,
	} = props;

	const dispatch = useDispatch();
	const ref_gallery = useRef();

	let galleries = useSelector(state => state.galleries);

	let sortOptionItems = [
		{ value: "random", label: "Random" },
		{ value: "date", label: "Date Taken" }
	];
	if (galleryType !== "Trip") {
		sortOptionItems.push({ value: "country", label: "Country Taken" });
	}

	const sortOptions = createListCollection({
		items: sortOptionItems,
	});

	const [st_sort, sst_sort] = useState("random");
	const [st_gallery,sst_gallery] = useState([]);
	const [st_sortedGallery, sst_sortedGallery] = useState([]);

	useEffect(()=>{
		if ( !galleries.loading ) {
			let gallery = galleries.galleries.filter( gal => gal.type === galleryType );

			if ( gallery.length ) {
				gallery = gallery[0].images.map((image, index) => {
					let caption = `${image.AnimalCommon} - ${image.AnimalScientific}`;
					if (image.Notes) {
						caption = `${caption}; ${image.Notes}`;
					}
					let placeholderURL = `https://${config.imagesDomain}/loadingRing.gif`;
					let imagePath = image.FilePath.replace("/images/", "/");
					let thumbPath = imagePath.replace("1500", "300");
					let thumbURL = `https://${config.imagesDomain}${thumbPath}${image.FileName}`;
					let fullURL = `https://${config.imagesDomain}${imagePath}${image.FileName}`;

					return {
						...image,
						index,
						caption,
						thumbURL,
						fullURL,
						src: fullURL
					};
				});
				sst_gallery( prev=>{
					if ( _.isEqual( prev, gallery ) ) {
						return prev;
					} else {
						return gallery;
					}
				} );
			}
		}
	},[
		galleryType,
		galleries,
	]);

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
			sortBy = "random";
			break;
		}

		if ( sortBy === "random" ) {
			let gall = [...st_gallery];
			shuffleArray( gall );
			sst_sortedGallery( gall );
		} else {
			sst_sortedGallery(_.sortBy(st_gallery, [sortBy]));
		}
		
	}, [
		st_gallery,
		st_sort,
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

	let handleThumbClick = (event, index) => {
		event.preventDefault();
		lightbox.loadAndOpen(index);
	}; // handleThumbClick

	const renderThumbBoxes = useCallback(images => {
		return images.map((image, index) => {
			return (
				<Box
					className={styles.thumbContainer}
					key={`galleryThumb_${image.ImageID}_${index}`}
					data-imageid={image.ImageID}
				>
					<PhotoGallery_Thumbnail
						image={image}
						index={index}
						handleClick={handleThumbClick}
					/>
				</Box>
			);
		})
	}, [
	]);

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
			<div style={{ margin: "10px" }}>
				{renderSortSelector()}
			</div>
			<Box
				paddingLeft={config.contentIndent}
				paddingRight={config.contentIndent}
				paddingTop="10px"
				ref={ref_gallery}
			>
				<ResponsiveMasonry
					columnsCountBreakPoints={ResponsiveMasonryBreakpoints.columns}
					gutterBreakpoints={ResponsiveMasonryBreakpoints.gutter}
				>
					<Masonry>
						{renderThumbBoxes(st_sortedGallery)}
					</Masonry>
				</ResponsiveMasonry>

			</Box>
		</Box>
	);
});

export default PhotoGallerySwipe;
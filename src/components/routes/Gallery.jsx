import { Fragment, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
	Stack,
	Box,
} from "@chakra-ui/react";
import {
	Skeleton,
} from "../ui/skeleton";

import PhotoGallerySwipe from "../myUI/PhotoGallerySwipe";
import GalleryList from "../myUI/GalleryList";
import GalleryBanner from "../myUI/GalleryBanner";

import { fetchGallery, fetchGalleryList } from "../../redux/slices/galleries";

const Gallery = props => {
	let {
		showTitle = true,
	} = props;

	let { galleryType, trip } = useParams();
	const dispatch = useDispatch();

	// console.log("galleryType",galleryType);
	// console.log("trip",trip);

	// props gallery type can override URL param
	if (props.galleryType) {
		galleryType = props.galleryType;
	}

	let galleries = useSelector(state => state.galleries);

	useEffect(() => {
		if (galleryType || trip) {
			let focusedType = galleryType ? galleryType : trip;

			let gallery = galleries.galleries.filter(gal => gal.type === focusedType);
			if (!gallery.length && !galleries.loading) {
				if (trip) {
					console.log("Gallery fetching trip gallery");
					dispatch(fetchGallery({
						trip: true,
						galleryType: trip
					}));
				} else {
					dispatch(fetchGallery({ galleryType }));
				}
			} else if (!galleries.loading) {
				// hmm what to do what to do
			}
		} else {
			let galleryList = galleries.galleryList;
			if (!galleryList.length && !galleries.loading) {
				// console.log("fetching galleryList");
				console.log("Gallery fetching default gallery");
				dispatch(fetchGalleryList());
			}
		}
	}, [
		galleries,
		galleryType,
		trip,
		dispatch,
	]);

	let bannerText;
	let pageTitle;

	switch (galleryType) {
		case "favorites":
			bannerText = "My Favorites";
			pageTitle = "Mike's Favorite Photos | Michael Willis Photography";
			break;
		case "Trip":
			bannerText = trip.replace("_", " ");
			pageTitle = `Trip: ${bannerText} | Michael Willis Photography`;
			break;
		case "Animal":
			bannerText = galleryType;
			if (bannerText === "newest") { bannerText = "Newest"; }
			pageTitle = `${bannerText} Photo Gallery | Michael Willis Photography`;
			break;
		case "Random":
			bannerText = "Some Random Photos";
			break;
		case "newest":
			bannerText = "My Newest Photos";
			pageTitle = `Newest Photos | Michael Willis Photography`;
			break;
		case "":
		case undefined:
			if (!trip) {
				bannerText = "Alphabetized Gallery List";
				pageTitle = `${bannerText} | Michael Willis Photography`;
			} else {
				bannerText = trip.replace("_", " ").replace(/([A-Z])/g, ' $1').trim();
				pageTitle = `${bannerText} | Michael Willis Photography`;
			}
			break;
		default:
			bannerText = galleryType ? galleryType.replace("_", " ") : "";
			pageTitle = `${bannerText} | Michael Willis Photography`;
			break;
	}

	return (
		<Fragment>
			{
				showTitle ? (
					<title>{pageTitle}</title>
				) : ""
			}
			
			{
				galleries.loading ? (
					<Box>
						<GalleryBanner text={bannerText} />
						<Stack direction="row" height="200px" padding="20px" wrap="wrap">
							{
								Array.from(Array(20)).map((entry, index) => {
									return <Skeleton key={`skellies|${index}`} height="200px" width="200px" />
								})
							}
						</Stack>
					</Box>
				) : (
					<Fragment>
						{
							galleryType || trip ? (
								<Box>
									<GalleryBanner text={bannerText} />
									<PhotoGallerySwipe galleryType={galleryType || trip} {...props} />
								</Box>
							) : (
								<Fragment>
									{
										galleries.galleryList.length ? (
											<Box>
												<GalleryBanner text="Alphabetized Subject List" />
												<GalleryList />
											</Box>
										) : (
											<Box>move along, nothing to see here folks</Box>
										)
									}
								</Fragment>
							)
						}
					</Fragment>
				)
			}
		</Fragment>
	);

};

export default Gallery;
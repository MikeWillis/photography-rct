import { Fragment, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
	Stack,
	Box,
} from "@chakra-ui/react";
import {
	Skeleton,
} from "../ui/skeleton";

import Link from "../general/Link";
import SearchByDate from "../general/SearchByDate";
import PhotoGallerySwipe from "../myUI/PhotoGallerySwipe";
import GalleryList from "../myUI/GalleryList";
import GalleryBanner from "../myUI/GalleryBanner";

import { fetchGallery, fetchByDate, fetchGalleryList } from "../../redux/slices/galleries";

const Gallery = props => {
	let {
		showTitle = true,
	} = props;

	let { galleryType, trip } = useParams();
	const dispatch = useDispatch();
	const isAdmin = useSelector((state) => state.auth.isAdmin);

	// console.log("galleryType",galleryType);
	// console.log("trip",trip);

	// props gallery type can override URL param
	if (props.galleryType) {
		galleryType = props.galleryType;
	}

	let galleries = useSelector(state => state.galleries);

	// 1. Create a persistent lock that doesn't trigger re-renders
	const fetchLock = useRef({});

	useEffect(() => {
		if ( galleryType !== "dateRange" ) {
			const focusedType = galleryType || trip;

			if (focusedType) {
				const gallery = galleries.galleries.filter(gal => gal.type === focusedType);
				
				// 2. Check the Redux state AND our manual lock
				if (!gallery.length && !galleries.loading && !fetchLock.current[focusedType]) {
					
					// 3. Lock it immediately (synchronous)
					fetchLock.current[focusedType] = true;
					
					const adminToken = localStorage.getItem('adminToken');
					// console.log("Fetching gallery for:", focusedType);
					
					dispatch(fetchGallery({
						trip: !!trip,
						galleryType: focusedType,
						adminToken: adminToken,
					})).finally(() => {
						// 4. Unlock when done (optional, or keep it locked to prevent re-fetches)
						fetchLock.current[focusedType] = false;
					});
				}
			} else {
				// Apply similar logic for galleryList if needed
				if (!galleries.galleryList.length && !galleries.loading && !fetchLock.current['list']) {
					fetchLock.current['list'] = true;
					dispatch(fetchGalleryList());
				}
			}
		}
	
		// We keep the dependencies as they were, but the Ref acts as the gatekeeper
	}, [galleries, galleryType, trip, dispatch]);

	// let galleries = useSelector(state => state.galleries);
	// useEffect(() => {
	// 	if (galleryType || trip) {
	// 		let focusedType = galleryType ? galleryType : trip;

	// 		let gallery = galleries.galleries.filter(gal => gal.type === focusedType);
	// 		if (!gallery.length && !galleries.loading) {
	// 			let adminToken = localStorage.getItem('adminToken');
	// 			if (trip) {
	// 				console.log("Gallery fetching trip gallery");
	// 				dispatch(fetchGallery({
	// 					trip: true,
	// 					galleryType: trip,
	// 					adminToken: adminToken,
	// 				}));
	// 			} else {
	// 				console.log("fetching regular gallery");
	// 				dispatch(fetchGallery({ galleryType, adminToken }));
	// 			}
	// 		} else if (!galleries.loading) {
	// 			// hmm what to do what to do
	// 		}
	// 	} else {
	// 		let galleryList = galleries.galleryList;
	// 		if (!galleryList.length && !galleries.loading) {
	// 			// console.log("fetching galleryList");
	// 			console.log("Gallery fetching default gallery");
	// 			dispatch(fetchGalleryList());
	// 		}
	// 	}
	// }, [
	// 	galleries,
	// 	galleryType,
	// 	trip,
	// 	dispatch,
	// ]);

	let handleSearchByDate = (dateType,startDate,endDate)=>{
		dispatch(fetchByDate({
			dateType: dateType,
			startDate: startDate,
			endDate: endDate,
		}));
	}; // handleSearchByDate

	let bannerText;
	let pageTitle;

	let specialGalleries = [
		"favorites",
		"newest",
		"dateRange",
		"threatened"
	];

	let showBreadcrumbs = true;
	if ( galleryType && specialGalleries.includes( galleryType.toLowerCase() ) ) {
		showBreadcrumbs = false;
	}
	
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

	console.log("galleryType",galleryType);
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
						
						{
							isAdmin && galleryType === "dateRange" ? (
								<SearchByDate handleSubmit={handleSearchByDate} />
							) : ""
						}

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
									
									{
										isAdmin && galleryType === "dateRange" ? (
											<SearchByDate handleSubmit={handleSearchByDate} />
										) : ""
									}

									{
										showBreadcrumbs ? (
											<Box
												width="100%"
												backgroundColor="#fff"
												padding="3px"
												margin="0px"
											>
												<Box
													width="80%"
													marginLeft="auto"
													marginRight="auto"
												>
													<Link
														variant="underline"
														to="/"
														text="Home"
													/>
													&nbsp;&gt;&nbsp;
													<Link
														variant="underline"
														to="/galleries/"
														text="Alphabetized"
													/>
													&nbsp;&gt;&nbsp;
													{galleryType}
												</Box>
											</Box>
										) : ""
									}

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
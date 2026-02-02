import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from "photoswipe";
import { Center, Spinner, Box, Button } from "@chakra-ui/react";

const isPathSafe = path=>{
	if (!path) return false;
	
	// 1. Block directory traversal (..)
	if (path.includes('..')) return false;
	
	// 2. Ensure it starts with the expected folder and ends with an image extension
	// Adjust the prefix "/photography/" if your folder structure is different
	const safePattern = /^\/photography\/.*\.(jpg|jpeg|png|gif|webp)$/i;
	return safePattern.test(path);
}; // isPathSafe

const SingleImage = props => {
	let { imageServer = "https://images.mikewillisphotography.com" } = props;

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const imagePath = searchParams.get("path");
	
	const [st_isLoading, sst_isLoading] = useState(true);
	const [st_error, sst_error] = useState(false);

	useEffect(() => {
		if (!imagePath) return;

		if (!isPathSafe(imagePath)) {
			console.error("Blocked a suspicious image path attempt.");
			return; 
		}

		// --- 2. Sanitize Browser Title ---
		// Extract filename: /path/to/my_photo.jpg -> my_photo.jpg
		const fileName = imagePath.split('/').pop();
		// Strip anything that isn't a letter, number, underscore, hyphen, or dot
		const cleanTitle = fileName.replace(/[^a-z0-9._-]/gi, '');
		document.title = `Photo: ${cleanTitle} | Mike Willis Photography`;

		const fullUrl = `${imageServer}${imagePath}`;
		const img = new Image();

		img.onload = () => {
			const lightbox = new PhotoSwipeLightbox({
				pswpModule: PhotoSwipe,
				dataSource: [{
					src: fullUrl,
					width: img.naturalWidth,
					height: img.naturalHeight,
					alt: 'Photography View'
				}],
				showHideAnimationType: 'fade',
			});

			lightbox.on('destroy', () => {
				// Navigate back to home or gallery when closed
				navigate('/');
			});

			lightbox.init();
			lightbox.loadAndOpen(0);
			sst_isLoading(false);

			// Track in GA
			if (typeof window.gtag === "function") {
				window.gtag("event", "direct_image_view", {
					photoPath: imagePath,
					imageWidth: img.naturalWidth,
					imageHeight: img.naturalHeight
				});
			}
		};

		img.onerror = () => {
			sst_error(true);
			sst_isLoading(false);
		};

		img.src = fullUrl;

		return () => {
			// Cleanup logic would go here if we stored lightbox in a ref, 
			// but since it's inside onload, it destroys on close via the 'destroy' listener.
		};
	}, [imagePath, imageServer, navigate]);

	if (st_error) return <Center h="100vh">Error loading image.</Center>;

	return (
		<Center h="100vh" bg="black" color="white">
			{st_isLoading && (
				<Box textAlign="center">
					<Spinner size="xl" mb={4} />
					<Box>Loading high-resolution preview...</Box>
				</Box>
			)}
			{!st_isLoading && (
				<Button variant="ghost" onClick={() => navigate('/')}>
					Return to Site
				</Button>
			)}
		</Center>
	);
};

export default SingleImage;
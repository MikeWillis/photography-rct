import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";

import { authActions } from "./auth";

import { config } from "../../config";

export const fetchGallery = createAsyncThunk("fetchGallery", async (settings) => {
	// console.log("fetchGallery called, settings:", settings);
	let searchType = settings.trip ? "trip" : "animal";
	let url = `https://${config.apiDomain}/api/get/galleryImages.php?${searchType}=${settings.galleryType}`;

	const formData = new FormData();
	formData.append("adminToken", settings.adminToken);

	let response = await fetch(url, {
		method: 'POST',
		body: formData,
		mode: 'cors',
	});
	
	const json = await response.json();
	return {
		type: settings.galleryType,
		images: json,
	};
});

export const fetchByDate = createAsyncThunk("fetchByDate", async (settings, { dispatch }) => {
	// console.log("fetchByDate called, settings:", settings);
	let dateType = settings.dateType ? settings.dateType : "dateTaken";
	let url = `https://${config.apiDomain}/api/get/galleryImages.php?dateType=${dateType}&startDate=${settings.startDate}&endDate=${settings.endDate}`;

	const formData = new FormData();
	formData.append("adminToken", settings.adminToken);

	let response = await fetch(url, {
		method: 'POST',
		body: formData,
		mode: 'cors',
	});

	if (!response.ok) {
		// yikes
		throw new Error('Network response was not ok');
	} else {
		// it's also quite likely that our server has refreshed the token
		const refreshedToken = response.headers.get('X-Refreshed-Token');
		if ( refreshedToken ) {
			localStorage.setItem('adminToken', refreshedToken);
			dispatch( authActions.setLogin(refreshedToken) );
		}
		
		const json = await response.json();
		return {
			type: "dateRange",
			images: json,
		};
	}
}); // fetchByDate

export const fetchGalleryList = createAsyncThunk("fetchGalleryList", async (type) => {
	const response = await fetch(`https://${config.apiDomain}/api/get/galleryList.php`);
	const json = await response.json();
	return {
		type: type,
		list: json,
	};
});

export const initialState = {
	loading: false,
	galleries: [],
	galleryList: [],
};

const galleriesSlice = createSlice({
	name: "galleries",
	initialState: initialState,
	reducers: {
		updateImage: (state, action) => {
			const updatedImage = action.payload; // Expecting the full image object
			console.log("Redux received update:", action.payload);
			// Find the gallery that contains this image
			state.galleries.forEach((gallery) => {
				const imageIndex = gallery.images.findIndex(
					(img) => img.ImageID === updatedImage.ImageID
				);
				
				if (imageIndex !== -1) {
					// Update the image data at that specific index
					gallery.images[imageIndex] = {
						...gallery.images[imageIndex],
						...updatedImage
					};
				}
			});
		},
	},
	extraReducers: (builder) => {
		// fetchGallery
		builder.addCase(fetchGallery.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchGallery.fulfilled, (state, action) => {
			let currentState = current(state);
			state.galleries = [
				...currentState.galleries.filter(gallery => gallery.type !== action.payload.type),
				{ 
					type: action.payload.type, 
					images: action.payload.images 
				}
			];
			state.loading = false;
		});
		builder.addCase(fetchGallery.rejected, (state) => {
			state.loading = false;
		});

		// fetchByDate
		builder.addCase(fetchByDate.pending, (state) => {
			state.loading = true;
			state.galleries = state.galleries.filter(gallery => gallery.type !== "dateRange");
		});
		builder.addCase(fetchByDate.fulfilled, (state, action) => {
			let currentState = current(state);
			console.log("action.payload",action.payload);
			state.galleries = [
				...currentState.galleries.filter(gallery => gallery.type !== action.payload.type),
				{ 
					type: action.payload.type, 
					images: action.payload.images 
				}
			];
			state.loading = false;
		});
		builder.addCase(fetchByDate.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(fetchGalleryList.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchGalleryList.fulfilled, (state, action) => {
			let currentState = current(state);
			console.log("action",action);
			state.galleryList = action.payload.list;
			state.loading = false;
		});
		builder.addCase(fetchGalleryList.rejected, (state) => {
			state.loading = false;
		});
	}
});


export const galleriesActions = galleriesSlice.actions;
export default galleriesSlice;


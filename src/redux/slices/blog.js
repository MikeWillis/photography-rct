import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { config } from "../../config";

export const fetchPosts = createAsyncThunk("posts/get", async () => {
	const response = await fetch(`https://${config.apiDomain}${config.wpEndpoint}posts?context=embed`);
	const json = await response.json();
	return json;
});

export const fetchCategories = createAsyncThunk("categories/get", async () => {
	const response = await fetch(`https://${config.apiDomain}${config.wpEndpoint}categories?context=embed`);
	const json = await response.json();
	return json;
});

export const fetchArchives = createAsyncThunk("archives/get", async () => {
	const response = await fetch(`https://${config.apiDomain}${config.wpEndpoint}posts/archives`);
	const json = await response.json();
	return json;
});

export const recentPostsSlice = createSlice({
	name: "recentPosts",
	initialState: {
		loading: false,
		loaded: false,
		recentPosts: []
	},
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(fetchPosts.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchPosts.fulfilled, (state, action) => {
			state.recentPosts = action.payload;
			state.loading = false;
			state.loaded = true;
		});
		builder.addCase(fetchPosts.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const categoriesSlice = createSlice({
	name: "categories",
	initialState: {
		loading: false,
		loaded: false,
		categories: []
	},
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCategories.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchCategories.fulfilled, (state, action) => {
			state.categories = action.payload;
			state.loading = false;
			state.loaded = true;
		});
		builder.addCase(fetchCategories.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const archivesSlice = createSlice({
	name: "archives",
	initialState: {
		loading: false,
		loaded: false,
		archives: []
	},
	reducers: {
	},
	extraReducers: (builder) => {
		builder.addCase(fetchArchives.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(fetchArchives.fulfilled, (state, action) => {
			state.archives = action.payload;
			state.loading = false;
			state.loaded = true;
		});
		builder.addCase(fetchArchives.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const recentPostsActions = recentPostsSlice.actions;
export const categoriesActions = categoriesSlice.actions;
export const archivesActions = archivesSlice.actions;


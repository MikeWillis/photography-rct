import { configureStore } from '@reduxjs/toolkit';

import navigationSlice from './slices/navigation';
import {recentPostsSlice, categoriesSlice,archivesSlice} from './slices/blog';
import galleriesSlice from './slices/galleries';
import authSlice from './slices/auth';

export const store = configureStore({
	reducer: {
		recentPosts: recentPostsSlice.reducer,
		categories: categoriesSlice.reducer,
		archives: archivesSlice.reducer,
		navigation: navigationSlice.reducer,
		galleries: galleriesSlice.reducer,
		auth: authSlice.reducer,
	},
});

export default store;
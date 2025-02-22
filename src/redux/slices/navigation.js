import { createSlice, current } from "@reduxjs/toolkit";

export const initialState = {
	menus: [
		{
			key: "galleries",
			title: "Galleries",
			links: [
				{
					key: "myFavorites",
					to: "/galleries/favorites",
					text: "My Favorites",
				},
				{
					key: "alphabetized",
					to: "/galleries/",
					text: "Alphabetized",
				},
				{
					key: "newest",
					to: "/galleries/newest",
					text: "Newest",
				},
			]
		},
		{
			key: "recentPosts",
			title: "Recent Posts",
			links: [],
		},
		{
			key: "trips",
			title: "Trips",
			links: [],
			fetch: true,
		},
		{
			key: "contact",
			title: "Contact",
			link: "/contact/",
			hideBelow: "md",
		},
		{
			key: "aboutMe",
			title: "About Me",
			link: "/posts/5/about-me/",
			hideBelow: "md",
		},
	],
};

const navigationSlice = createSlice({
	name: "navigation",
	initialState: initialState,
	reducers: {
		setFetchedLinks(state, action) {
			let currentState = current(state);
			state.menus = currentState.menus.map(menu=>{
				if ( menu.key !== action.payload.menuKey ) {
					return menu;
				} else {
					return { ...menu, links: action.payload.links, fetch: false };
				}
			});
		}
	}
});


export const navigationActions = navigationSlice.actions;
export default navigationSlice;


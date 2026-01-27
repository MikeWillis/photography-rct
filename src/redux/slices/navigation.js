import { createSlice, createSelector, current } from "@reduxjs/toolkit";

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
				{
					key: "dateRange",
					to: "/galleries/dateRange",
					text: "By Date",
					permissions: "admin",
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

// selectors
const selectAllMenus = (state) => state.navigation.menus;
const selectIsAdmin = (state) => state.auth.isAdmin;

// get the filtered navigation
// get the filtered navigation
export const selectFilteredNavigation = createSelector(
	[selectAllMenus, selectIsAdmin],
	(menus, isAdmin) => {
		const filteredMenus = menus.map(menu => ({
			...menu,
			links: menu.links ? menu.links.filter(link => {
				if (link.permissions === 'admin') {
					return isAdmin;
				}
				return true;
			}) : []
		}));

		// Return an object so navigation.menus.map works
		return { menus: filteredMenus }; 
	}
); // selectFilteredNavigation

export const navigationActions = navigationSlice.actions;
export default navigationSlice;


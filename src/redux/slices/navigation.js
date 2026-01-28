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
					key: "threatened",
					to: "/galleries/threatened",
					text: "Threatened",
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
	conservationLinks: [
		{
			text: "World Wildlife Fund",
			image: {
				path: "/logos/wwf.jpg",
			},
			to: "https://www.worldwildlife.org/",
			blurb: `The leading organization in wildlife conservation and endangered species. Visit their site to learn how you can help WWF make a difference.`,
		},
		{
			text: "International Rhino Foundation",
			image: {
				path: "/logos/internationalRhinoFoundation.jpg",
			},
			to: "https://rhinos.org/",
			blurb: `For 25 years, the International Rhino Foundation has championed the survival of the world's rhinos through conservation and research.`,
		},
		{
			text: "National Geographic Big Cats Initiative",
			image: {
				path: "/logos/nationalGeographic.jpg",
			},
			to: "https://donate.nationalgeographic.org/SSLPage.aspx?pid=1536",
			blurb: `Help save big cats in the wild. 100% of your donation supports the fieldwork of the Society's scientists.`,
		},
		{
			text: "National Wildlife Federation",
			image: {
				path: "/logos/nationalWildlifeFederation.jpg",
			},
			to: "https://www.nwf.org/",
			blurb: `Help wildlife: your donation today will go straight to work protecting polar bears, bison and many more at-risk species.`,
		},
	]
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
export const selectConservationLinks = (state) => state.navigation.conservationLinks;

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


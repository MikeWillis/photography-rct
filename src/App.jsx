import { useEffect } from "react";
import {
	Button,
	Center,
	HStack,
	Container,
	Box,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "./redux/slices/blog";
import { Routes, Route, useLocation } from "react-router";
import ReactGA from "react-ga4";
import { Toaster } from "./components/ui/toaster";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/routes/Home";
import BlogPost from "./components/routes/BlogPost";
import Gallery from "./components/routes/Gallery";
import BlogPosts from "./components/routes/BlogPosts";
import Contact from "./components/routes/Contact";
import AdminLogin from "./components/routes/AdminLogin";
import ThirdPartyScripts from "./components/general/ThirdPartyScripts";

import { navigationActions } from "./redux/slices/navigation";

import { mainContainer } from "./styles/mainContainer.module.scss";
import { default as generalStyles } from "./styles/general.module.scss";

ReactGA.initialize("G-VBZTEN7KEF");

function App() {
	const dispatch = useDispatch();
	let recentPosts = useSelector(state => state.recentPosts);
	let location = useLocation();

	useEffect(() => {
		if (!recentPosts.recentPosts.length && !recentPosts.loaded && !recentPosts.loading) {
			dispatch(fetchPosts());
		} else if (!recentPosts.recentPosts.length && recentPosts.loaded) {
			// hmph, the load must have failed :(
		} else if (recentPosts.recentPosts.length) {
			// yay
		}
	}, [
		dispatch,
		recentPosts
	]);

	useEffect(() => {
		if (recentPosts.loaded) {
			dispatch(
				navigationActions.setFetchedLinks({
					menuKey: "recentPosts",
					links: recentPosts.recentPosts.map(post => {
						return {
							to: `/posts/${post.id}/${post.slug}/`,
							text: post.LinkText,
						};
					})
				})
			);
		}
	}, [
		recentPosts.loaded,
		recentPosts.recentPosts,
		dispatch,
	]);

	useEffect(() => {
		// console.log("url changed, location:", location);
		if ( !location.hash ) {
			ReactGA.send({ hitType: "pageview", page: location.pathname });
		}
	}, [
		location,
	]);

	return (
		<Box
			className={mainContainer}
		>

			<Header />

			<Box
				className={generalStyles.content100vw}
				minHeight="80vh"
				margin="0"
				padding="0"
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/contact/" element={<Contact />} />
					<Route path="/adminLogin/" element={<AdminLogin />} />
					<Route path="/galleries/:galleryType?" element={<Gallery />} />
					<Route path="/trips/:trip" element={<Gallery />} />
					<Route path="/posts/:id/:slug/" element={<BlogPost />} />
					<Route path="/categories/:searchA/:searchB" element={<BlogPosts searchType="categories" />} />
					<Route path="/archives/:searchA/:searchB/" element={<BlogPosts searchType="archives" />} />
				</Routes>
			</Box>

			<Footer />

			<ThirdPartyScripts />

			<Toaster />
		</Box>
	)
}

export default App;
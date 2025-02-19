import { Fragment, useState, useEffect } from "react";
import {
	Box,
} from "@chakra-ui/react";
import { useParams } from "react-router";

import BlogPostList from "../general/BlogPostList";
import AnimatedHeading from "../myUI/AnimatedHeading";

import { getFullMonth } from "../../util";
import { config } from "../../config";

import generalStyles from "../../styles/general.module.scss";

const searchPosts = async (searchType, searchA, searchB) => {
	let endpoint = `https://${config.apiDomain}${config.wpEndpoint}posts?context=embed`;
	let result = [];

	if (searchType === "categories") {
		if (searchA !== "") {
			endpoint = `${endpoint}&categories=${searchA}`;
		} else {
			endpoint = false;
		}
	} else if (searchType === "archives") {
		if (searchA && searchA !== "" && searchB && searchB !== "") {
			let daysInMonth = new Date(parseInt(searchA), parseInt(searchB), 0).getDate();
			let searchStart = `${searchA}-${searchB.padStart(2, "0")}-01T00:00:00`;
			let searchEnd = `${searchA}-${searchB.padStart(2, "0")}-${daysInMonth}T00:00:00`;
			endpoint = `${endpoint}&after=${searchStart}&before=${searchEnd}`;
		} else {
			endpoint = false;
		}
	} else {
		endpoint = false;
	}

	if (!endpoint) {
		return result;
	} else {
		console.log("searching posts, endpoint:", endpoint);
		const response = await fetch(endpoint);
		//console.log("response:",response);
		if (response.ok) {
			//console.log("response.data",response.data);
			result = await response.json();
			return result;
		} else {
			return result;
		}
	}

}; // searchPosts

const BlogPosts = props => {
	let {
		searchType,
	} = props;

	let { searchA, searchB } = useParams();

	const [st_posts, sst_posts] = useState([]);

	useEffect(() => {
		const getPosts = async () => {
			let posts = await searchPosts(searchType, searchA, searchB);
			console.log("posts", posts);
			sst_posts(posts);
		};
		getPosts();
	}, [
		searchType,
		searchA,
		searchB,
	]);

	let heading;

	switch( searchType ) {
	case "categories":
		heading = `Latest ${searchB} Posts`;
		break;
	case "archives":
		heading = `${getFullMonth(searchB - 1)} ${searchA} Posts`;
		break;
	}
	return (
		<Box
			className={`blogPost ${generalStyles.content} ${generalStyles.content100vw}`}
			paddingLeft={config.contentIndent}
			paddingRight={config.contentIndent}
			marginTop="30px"
			paddingTop="5px"
			paddingBottom="5px"
		>
			<AnimatedHeading
				heading={heading}
				marginLeft="0px"
				marginRight="0px"
			/>
			<BlogPostList posts={st_posts} />
		</Box>
	);
};

export default BlogPosts;
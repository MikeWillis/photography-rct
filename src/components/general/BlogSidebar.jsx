import { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import he from "he";
import { Interweave } from 'interweave';
import {
	Box,
	Flex,
	Skeleton,
	Link as ChakraLink,
	Text,
	List,
} from "@chakra-ui/react";
import {
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "../ui/dialog";

import AnimatedHeading from "../myUI/AnimatedHeading";
import Link from "../general/Link";

import { fetchCategories, fetchPosts, fetchArchives } from "../../redux/slices/blog";

import styles from "../../styles/blogGeneral.module.scss";
import { getFullMonth } from "../../util";

const BlogSidebar_LinkList = props => {
	console.log("sidebar props:", props);
	return (
		<Box>
			<AnimatedHeading
				heading={props.heading}
				as="h3"
				size="lg"
				marginLeft="0px"
				marginRight="0px"
			/>

			<List.Root listStyleType="none">
				{
					props.links.map((link, index) => {
						let linkTo;
						let linkText;
						switch (props.linkType) {
							case "posts":
								linkTo = `/posts/${link.id}/${link.slug}/`;
								linkText = link.LinkText;
								break;
							case "categories":
								linkTo = `/categories/${link.id}/${link.slug}/`;
								linkText = link.name;
								break;
							case "archives":
								linkTo = `/archives/${link.year}/${link.month}/`;
								linkText = `${getFullMonth(parseInt(link.month) - 1)}, ${link.year} - ${link.posts} posts`;
								break;
						}
						return (
							<List.Item key={`linkList|${props.linkType}|${index}`}>
								<Link
									variant="underline"
									to={linkTo}
									text={linkText}
								/>
							</List.Item>
						);
					})
				}
			</List.Root>
		</Box>
	);
}; // BlogSidebar_LinkList

const BlogSidebar = props => {
	const dispatch = useDispatch();

	let categories = useSelector(state => state.categories);
	let recentPosts = useSelector(state => state.recentPosts);
	let archives = useSelector(state => state.archives);

	useEffect(() => {
		// console.log("categories useEffect running:", categories);
		if (!categories.categories.length && !categories.loaded && !categories.loading) {
			console.log("BlogSidebar dispatching fetchCategories");
			dispatch(fetchCategories());
		} else if (!categories.categories.length && categories.loaded) {
			// hmph, the load must have failed :(
		} else if (categories.categories.length) {
			// yay
		}
	}, [
		dispatch,
		categories,
	]);

	useEffect(() => {
		// console.log("categories useEffect running:", categories);
		if (!archives.archives.length && !archives.loaded && !archives.loading) {
			console.log("BlogSidebar dispatching fetchArchives");
			dispatch(fetchArchives());
		} else if (!archives.archives.length && archives.loaded) {
			// hmph, the load must have failed :(
		} else if (archives.archives.length) {
			// yay
			console.log("archives",archives);
		}
	}, [
		dispatch,
		archives,
	]);

	useEffect(() => {
		if (!recentPosts.recentPosts.length && !recentPosts.loaded && !recentPosts.loading) {
			console.log("BlogSidebar dispatching fetchPosts");
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

	return (
		<Box
			className={styles.sidebarContainer}
			borderLeftColor={"{colors.teal.solid}"}
		>
			{
				recentPosts.recentPosts.length ? (
					<BlogSidebar_LinkList
						heading="Recent Posts"
						linkType="posts"
						links={recentPosts.recentPosts}
					/>
				) : ""
			}

			{
				categories.categories.length ? (
					<BlogSidebar_LinkList
						heading="Categories"
						linkType="categories"
						links={categories.categories}
					/>
				) : ""
			}

			{
				archives.archives.length ? (
					<BlogSidebar_LinkList
						heading="Archives"
						linkType="archives"
						links={archives.archives}
					/>
				) : ""
			}

		</Box>
	);
};

export default BlogSidebar;
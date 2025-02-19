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
import BlogSidebar from "../general/BlogSidebar";

import { fetchCategories } from "../../redux/slices/blog";

import { getFullMonth } from "../../util";
import { config } from "../../config";
import transform from "../../util/transformers";
import {
	getPost,
	getAuthor,
} from "../../util/wp";

import "../../styles/blogPost.css";
import styles from "../../styles/blogPost.module.scss";
import { default as generalStyles } from "../../styles/general.module.scss";

let fixImagePaths = post=>{
	post.content.rendered = post.content.rendered.replaceAll( `src="/images/`, `src="https://${config.imagesDomain}/` );
	post.content.rendered = post.content.rendered.replaceAll( `src='/images/`, `src='https://${config.imagesDomain}/` );
	return post;
}; // fixImagePaths

let formatPostDate = date=>{
	console.log("date",date);
	date = new Date( date );
	console.log("date",date);
	let month = date.getMonth();
	month = getFullMonth( month );
	return `${month} ${date.getDate()}, ${date.getFullYear()}`;
}; // formatPostDate

const BlogPost = props => {
	let { id, slug } = useParams();
	const dispatch = useDispatch();

	let categories = useSelector(state => state.categories);

	const [st_post, sst_post] = useState(null);
	const [st_postDate,sst_postDate] = useState(null);
	const [st_author, sst_author] = useState(null);
	const [st_dialogOpen, sst_dialogOpen] = useState(false);
	const [st_focusedImage, sst_focusedImage] = useState(null);

	useEffect(()=>{
		// console.log("categories useEffect running:", categories);
		if ( !categories.categories.length && !categories.loaded && !categories.loading ) {
			console.log("BlogPost dispatching fetchCategories");
			dispatch( fetchCategories() );
		} else if ( !categories.categories.length && categories.loaded ) {
			// hmph, the load must have failed :(
		} else if ( categories.categories.length ) {
			// yay
		}
	},[
		dispatch,
		categories,
	]);


	useEffect(() => {
		let getPostData = async () => {
			let postData = await getPost(id);
			let author = await getAuthor(postData.author);
			sst_post(fixImagePaths(postData));
			sst_author(author);
			sst_postDate(formatPostDate(postData.date));
		}; // getPostData

		getPostData();

	}, [
		id,
	]);

	let setFocusedImage = event => {
		event.preventDefault();
		console.log("event.currentTarget",event.currentTarget);
		console.log("event.currentTarget.href",event.currentTarget.href);

		let imagePath = event.currentTarget.getAttribute("href");
		imagePath = imagePath.replace("/images/", "/");
		imagePath = imagePath.replace("https://www.mikewillisphotography.com/", "/");
		console.log("imagePath",imagePath);
		let fullURL;
		if ( imagePath.indexOf( "/blog/wp-content/uploads/" ) !== -1 ) {
			fullURL = `https://${config.apiDomain}${imagePath}`;
		} else {
			fullURL = `https://${config.imagesDomain}${imagePath}`;
		}
		sst_focusedImage(fullURL);
		sst_dialogOpen(true);
	}; // setFocusedImage

	useEffect(() => {
		document.querySelectorAll(".blogPost a.gallery").forEach(el => {
			el.addEventListener("click", setFocusedImage);
		});
	}, [
		st_post,
		setFocusedImage,
	]);

	let renderPostedIn = () => {
		//console.log("length:",this.state.post.categories.length);
		return st_post.categories.map( (category,index)=>{
				//console.log("index",index);
				// There can be only one.
				let matchCategory = categories.categories.filter( entry=>{
					return entry.id === category;
				})[0];
				
				if ( !matchCategory ) {
					return "";
				} else {
					let href = `/categories/${matchCategory.id}/${matchCategory.name}`;
					//console.log("href",href);
					let commaSpaceAfter = (index + 1 < st_post.categories.length) ? "," : "";
					return (
						<Fragment key={matchCategory.id}>
							<Link
								variant="underline"
								to={href}
								text={`${matchCategory.name}${commaSpaceAfter}`}
								spaceAfter={commaSpaceAfter}
							/>
							{
								commaSpaceAfter ? (
									<Fragment>&nbsp;&nbsp;</Fragment>
								) : ""
							}
						</Fragment>
					);
				}
		});
	}; // renderPostedIn

	let renderAuthor = ()=>{
		return (
				<Fragment>
					Posted in: {renderPostedIn()}
					&nbsp;by {
						st_post.author === 1 ? (
							<Link
								variant="underline"
								to="/posts/5/about-me/"
								text={st_author.name}
							/>
						) : (
							st_author.name
						)
					}
				</Fragment>
		);
	}; // renderAuthor

	return (
		<Box
			className={`blogPost ${generalStyles.content} ${generalStyles.content100vw}`}
			paddingLeft={config.contentIndent}
			paddingRight={config.contentIndent}
			marginTop="30px"
			paddingTop="5px"
			paddingBottom="5px"
		>
			<Flex
				gap="3"
			>
				<Box
					flex="1"
					padding="3px"
				>
					{
						!st_post ? (
							<Box>No Post Yet :(</Box>
						) : (
							<Fragment>
								<AnimatedHeading
									heading={`${he.decode( st_post.title.rendered )}`}
									marginLeft="0px"
									marginRight="0px"
								/>
								<Box>
									<Text fontStyle="italic" paddingLeft="3vw">
										{ st_author ? renderAuthor() : "" }
										{" "} on {st_postDate}
									</Text>
									<Interweave
										content={st_post.content.rendered}
										transform={transform}
									/>
								</Box>
							</Fragment>
						)
					}
				</Box>

				<BlogSidebar />
			</Flex>

			<DialogRoot
				lazyMount
				open={st_dialogOpen}
				onOpenChange={(e) => sst_dialogOpen(e.open)}
				size="full"
				placement="center"
				motionPreset="slide-in-bottom"
				scrollBehavior="inside"
			>
				<DialogContent padding="3px" backgroundColor="rgba(0, 0, 0, 0.5)">
					<DialogHeader />
					<DialogBody>
						<img
							src={st_focusedImage}
							alt={`blog post image`}
							style={{marginLeft: "auto", marginRight:"auto"}}
						/>
					</DialogBody>
					<DialogCloseTrigger backgroundColor="#fff" />
				</DialogContent>
			</DialogRoot>
		</Box>
	);
};

export default BlogPost;
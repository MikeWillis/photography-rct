import { Fragment } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import {
	Container,
	Text,
	Heading,
	Grid,
	GridItem,
	Box,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";

import BlurbLink from "../general/BlurbLink";
import PhotoGallerySwipe from "../myUI/PhotoGallerySwipe";
import Gallery from "./Gallery";
import AnimatedHeading from "../myUI/AnimatedHeading";

import { config } from "../../config";

import styles from "../../styles/home.module.scss";
import { default as generalStyles } from "../../styles/general.module.scss";

let galleryLinks = [
	{
		text: "My Favorites",
		to: "/animals/favorites",
		blurb: `This is a "smaller" gallery of my personal favorites. These are usually images that capture a unique moment, or do a great job of highlighting an animal's beauty.`,
	},
	{
		text: "Alphabetized",
		to: "/animals/",
		blurb: `Alphabetized list of all animals (and nature photos). Click an animal to see all the pictures I've taken of it.`,
	},
	{
		text: "Newest",
		to: "/animals/newest",
		blurb: `Newest photos, usually from my most recent travels.`,
	},
]; // galleryLinks

let conservationLinks = [
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
]; // conservationLinks

const Home = props => {
	let recentPosts = useSelector(state => state.recentPosts);

	return (
		<Box
			padding="5vh 0 10vh 0"
		>
			<Box
				height="81vh"
			>
				<AnimatedHeading heading="Wildlife Photography" />
			</Box>

			<Box className={`${generalStyles.content} ${generalStyles.content100vw}`}>
				<Heading
					size="3xl"
					color={`${config.colorPalette}.fg`}
					textAlign={"center"}
				>
					Wildlife Galleries
				</Heading>

				<Wrap
					className={styles.grids}
					paddingLeft={config.contentIndent}
					paddingRight={config.contentIndent}
					gap="20px"
				>
					{
						galleryLinks.map((link,index)=>{
							return (
								<WrapItem
									key={`galleryLinks|${link.to}|${link.index}`}
									width={{ sm: "100%", md: "32%" }}
									padding="3px"
								>
									<BlurbLink
										variant="underline"
										to={link.to}
										text={link.text}
										blurb={link.blurb}
									/>
								</WrapItem>
							)
						})
					}
				</Wrap>
			</Box>

			<Box className={`${generalStyles.content} ${generalStyles.content100vw}`}>
				<Heading
					size="3xl"
					color={`${config.colorPalette}.fg`}
					textAlign={"center"}
				>
					Latest Blog Posts
				</Heading>

				<Wrap
					className={styles.grids}
					paddingLeft={config.contentIndent}
					paddingRight={config.contentIndent}
					gap="20px"
				>
					{
						recentPosts.loaded ? (
							<Fragment>
								{
									recentPosts.recentPosts.slice(0,3).map((post,index)=>{
										let to = `/posts/${post.id}/${post.slug}`;

										return (
											<WrapItem
												key={`recentPosts|${to}|${index}`}
												width={{ sm: "100%", md: "32%" }}
												padding="3px"
											>
												<BlurbLink
													variant="underline"
													to={to}
													text={post.LinkText}
													blurb={post.excerpt.rendered}
													blurbRendered={true}
												/>
											</WrapItem>
										)
									})
								}
							</Fragment>
						) : ""
					}
				</Wrap>
			</Box>

			<Box className={`${generalStyles.content} ${generalStyles.content100vw}`}>
				<Heading
					size="3xl"
					color={`${config.colorPalette}.fg`}
					textAlign={"center"}
				>
					Conservation
				</Heading>
				
				<Text textAlign="center">
					Conservation is extremely important to me. Unfortunately, too many of our world's most beautiful animals are being illegally hunted to the brink of extinction. Please consider donating to one of the organizations below.
				</Text>

				<Wrap
					className={styles.grids}
					paddingLeft={config.contentIndent}
					paddingRight={config.contentIndent}
					gap="20px"
				>
					{
						conservationLinks.map((link,index)=>{
							return (
								<WrapItem
									key={`conservationLinks|${link.to}|${index}`}
									width={{ sm: "100%", md: "23%" }}
									padding="3px"
								>
									<BlurbLink
										variant="underline"
										to={link.to}
										text={link.text}
										blurb={link.blurb}
										image={link.image}
									/>
								</WrapItem>
							)
						})
					}
				</Wrap>
			</Box>

			<Gallery galleryType="Random" />
		</Box>
	);
};

export default Home;
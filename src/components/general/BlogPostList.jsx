import { Fragment } from "react";
import {
	Box,
} from "@chakra-ui/react";

import { Interweave } from "interweave";

import Link from "./Link";
import BlurbLink from "./BlurbLink";

import transform from "../../util/transformers";

const BlogPostList = props => {
	let {
		posts,
	} = props;

	let renderBlurb = blurb => {
		return (
			<Interweave
				content={blurb}
				transform={transform}
			/>
		);
	}; // renderBlurb

	return (
		<Box marginTop="20px">
			{
				posts.length ? (
					posts.map((post,index) => {

						return (
							<BlurbLink
								key={`blurbLink|${post.id}|${post.slug}|${index}`}
								variant="underline"
								to={`/posts/${post.id}/${post.slug}/`}
								text={post.LinkText || "notext"}
								blurb={renderBlurb(post.excerpt.rendered)}
								align="left"
								useBox={true}
							/>
						);
					})
				) : ""
			}
		</Box>
	);
};

export default BlogPostList;
import { Fragment } from "react";
import {
	Link as ChakraLink,
	Box,
	List,
	Heading,
} from "@chakra-ui/react";

import Link from "../components/general/Link";
import { config } from "../config";

const fixLinkTo = to => {
	console.log("fixLinkTo called for:", to);
	if ( to ) {
		let removals = [
			"https://",
			"www.mikewillisphotography.com",
			"data.mikewillisphotography.com",
		];
		let replacements = [
			{
				find: "/galleryByTrip.php?trip=",
				replace: "/trips/"
			},
			{
				find: "/blog/wp-content/uploads",
				replace: "data.mikewillisphotography.com/blog/wp-content/uploads"
			},
		];
		removals.forEach(remove=>{
			to = to.replace( remove, "" );
		});
		replacements.forEach( replace=>{
			to = to.replace( replace.find, replace.replace );
		} )
	}

	return to;
}; // fixLinkTo

const transformA = (node, children) => {
	console.log("transformA called for node href:", node.getAttribute("href"));
	console.log("transformA !node.getAttribute(class)",!node.getAttribute("class"));
	console.log("transformA test 2:",node.getAttribute("class")?.indexOf("gallery") === -1);
	if (
		// node.getAttribute("href")?.indexOf("mikewillisphotography") !== -1 &&
		(
			!node.getAttribute("class") ||
			node.getAttribute("class")?.indexOf("gallery") === -1 ||
			node.getAttribute("href")?.indexOf("/blog/wp-content/uploads") !== -1
		)
	) {

		if ( node.innerText === "Continue Reading" ) {
			// just get rid of these
			return <Fragment></Fragment>;
		} else if ( !node.getAttribute("href") && node.getAttribute("id") ) {
			// looks like an anchor point, let's add a margin to the top so we don't scroll too far when we click to it
			return (
				<a
					id={node.getAttribute("id")}
					style={{scrollMarginTop:"100px"}}
				>
					{...children}
				</a>
			);
		} else if (node.getAttribute("href")?.charAt(0) === "#") {
			// internal anchor link, don't use router
			return (
				<ChakraLink
					href={node.getAttribute('href')}
					variant="underline"
				>
					{children[0]}
				</ChakraLink>
			)
		} else if (node.getAttribute("href").indexOf("mikewillisphotography.com") === -1) {
			// external link, don't use router and don't apply any fixes
			return (
				<ChakraLink
					href={node.getAttribute('href')}
					variant="underline"
					target="_blank"
				>
					{children[0]}
				</ChakraLink>
			);
		} else if ( node.getAttribute("href")?.indexOf("/blog/wp-content/uploads") === -1 ) {
			// internal link, use router
			console.log("transformA internal link??");
			return (
				<Link
					variant="underline"
					to={fixLinkTo(node.getAttribute('href'))}
					text={children[0]}
				/>
			);
		} else {
			let oldRef = node.getAttribute('href');
			let newRef = oldRef.replace("www.mikewillisphotography.com/blog/wp-content/uploads", "data.mikewillisphotography.com/blog/wp-content/uploads");
			console.log("oldRef",oldRef);
			console.log("newRef",newRef);
			node.setAttribute("href", newRef );
		}
	}
}; // transformA

const transformIMG = (node, children) => {
	let src = node.getAttribute("src");
	if ( src.indexOf("www.mikewillisphotography.com/blog/wp-content/uploads") ) {
		node.setAttribute("src", src.replace("www.mikewillisphotography.com/blog/wp-content/uploads", "data.mikewillisphotography.com/blog/wp-content/uploads"))
	}
}; // transformIMG

const transform = (node, children) => {
	switch (node.tagName) {
	case "A": return transformA(node,children); break;
	case "IMG": return transformIMG(node,children); break;
	case "DIV": return <Box>{...children}</Box>; break;
	case "LI": return <List.Item>{...children}</List.Item>; break;
	case "OL": return <List.Root listStyleType="number">{...children}</List.Root>; break;
	case "UL": return <List.Root>{...children}</List.Root>; break;
	case "H4": return <Heading size="2xl" color={`${config.colorPalette}.fg`}>{...children}</Heading>; break;
	}
};

export default transform;
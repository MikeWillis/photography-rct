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
			}
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
	if (
		// node.getAttribute("href")?.indexOf("mikewillisphotography") !== -1 &&
		(!node.getAttribute("class") || node.getAttribute("class")?.indexOf("gallery") === -1)
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
		} else {
			// internal link, use router
			return (
				<Link
					variant="underline"
					to={fixLinkTo(node.getAttribute('href'))}
					text={children[0]}
				/>
			);
		}
	}
}; // transformA

const transform = (node, children) => {
	switch (node.tagName) {
	case "A": return transformA(node,children); break;
	case "DIV": return <Box>{...children}</Box>; break;
	case "LI": return <List.Item>{...children}</List.Item>; break;
	case "OL": return <List.Root listStyleType="number">{...children}</List.Root>; break;
	case "UL": return <List.Root>{...children}</List.Root>; break;
	case "H4": return <Heading size="2xl" color={`${config.colorPalette}.fg`}>{...children}</Heading>; break;
	}
};

export default transform;
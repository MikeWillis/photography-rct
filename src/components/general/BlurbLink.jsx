import { Fragment } from "react";
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

import { config } from "../../config";

import Link from "./Link";

const BlurbLink = props=>{
	let textAlign = props.align || "center";

	return (
		<Grid gap="10px">
			<GridItem>
				<Heading
					size="lg"
					color={`${config.colorPalette}.fg`}
					textAlign={textAlign}
				>
					<Link
						variant={props.variant}
						to={props.to}
						text={props.text}
						image={props.image}
					/>
					
				</Heading>
			</GridItem>
			<GridItem>
				{
					props.blurbRendered ? (
						<Text textAlign={textAlign} dangerouslySetInnerHTML={ {__html: props.blurb} }>
						</Text>
					) : (
						<Fragment>
							{
								props.useBox ? (
									<Box textAlign={textAlign}>
										{props.blurb}
									</Box>
								) : (
									<Text textAlign={textAlign}>
										{props.blurb}
									</Text>
								)
							}
						</Fragment>
					)
				}
			</GridItem>
		</Grid>
	);
};

export default BlurbLink;
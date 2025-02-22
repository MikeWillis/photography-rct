import { Fragment } from "react";
import { NavLink } from "react-router";
import {
	Link as ChakraLink,
	Grid,
	GridItem,
	Center,
} from "@chakra-ui/react";

import { config } from "../../config";

const Link = props=>{
	return (
		<ChakraLink variant={props.variant} asChild className={props.className || null}>
			<NavLink to={props.to} end>
				{
					props.image ? (
						<Grid>
							<GridItem>
								<Center>
									<img
										src={`https://${config.imagesDomain}${props.image.path}`}
										alt={props.image.alt || "image"}
									/>
								</Center>
							</GridItem>
							<GridItem>
								{props.text}
							</GridItem>
						</Grid>
					) : (
						<Fragment>
							{props.text}
						</Fragment>
					)
				}
			</NavLink>
		</ChakraLink>
	);
};

export default Link;
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaAngleDown } from "react-icons/fa";
import {
	Flex,
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
	Text,
	Link as ChakraLink,
} from "@chakra-ui/react";

import Link from "../general/Link";

import { navigationActions } from "../../redux/slices/navigation";

import { config } from "../../config";

import styles from "../../styles/navigation.module.scss";

const Navigation = props => {
	let navigation = useSelector(state => state.navigation);
	const dispatch = useDispatch();

	let handleFetch = async (menu)=>{
		if ( !menu.fetch ) {
			// nothing to see here
		} else {
			let url;
			switch( menu.key ) {
			case "trips":
				url = `https://${config.apiDomain}/api/get/trips.php`;
				break;
			default:
				// do nothing
				break;
			}

			const response = await fetch( url );
			if ( !response.ok ) {
				// damn
			} else {
				let json = await response.json();
				let links = json.map(link=>{
					let to;
					switch( menu.key ) {
					case "trips":
						to = link.path;
						break;
					default:
						// do nothing
					}
					return {
						key: to,
						to: to,
						text: link.text,
					};
				});

				dispatch(
					navigationActions.setFetchedLinks({
						menuKey: menu.key,
						links: links
					})
				);
			}
		}
		

		
	}; // handleFetch

	return (
		<Fragment>
			<Flex
				className={styles.navigation}
				gap="5"
				asChild
			>
				<ul>
					{
						navigation.menus.map((menu, index) => {
							return (
								<Fragment key={`${menu.index}|${menu.title}`}>
									{
										menu.links ? (
											<li>
												<MenuRoot>
													<MenuTrigger asChild>
														<ChakraLink
															variant="underline"
															onMouseOver={event=>handleFetch(menu)}
															onClick={event=>handleFetch(menu)}
														>
															{menu.title} <FaAngleDown />
														</ChakraLink>
													</MenuTrigger>

													<MenuContent position="absolute">
														{
															menu.links.map((link, index) => {
																return (
																	<MenuItem key={`${index}|${link.text}`} value={link.to}>
																		<Link
																			variant="underline"
																			to={link.to}
																			text={link.text}
																		/>
																	</MenuItem>
																)
															})
														}
													</MenuContent>
												</MenuRoot>
											</li>
										) : (
											<Fragment>
												{
													menu.link ? (
														<li>
															<Link
																variant="underline"
																to={menu.link}
																text={menu.title}
															/>
														</li>
													) : ""
												}
											</Fragment>
										)
									}
								</Fragment>
							);
						})
					}
				</ul>
			</Flex>
		</Fragment>
	);
};

export default Navigation;
import { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaAngleDown, FaBars } from "react-icons/fa";
import {
	Flex,
	Portal,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
	Box,
	Button,
	Link as ChakraLink,
} from "@chakra-ui/react";
import {
	MenuContent,
	MenuItem,
	MenuRoot,
	MenuTrigger,
	MenuTriggerItem,
} from "../ui/menu";

import Link from "../general/Link";

import { navigationActions,selectFilteredNavigation } from "../../redux/slices/navigation";

import { config } from "../../config";

import styles from "../../styles/navigation.module.scss";

const Navigation = props => {
	let {
		hideLogo,
	} = props;

	// let navigation = useSelector(state => state.navigation);
	let navigation = useSelector(selectFilteredNavigation);

	const dispatch = useDispatch();

	const [st_menuOpen,sst_menuOpen] = useState(false);

	let handleFetch = async (menu) => {
		if (!menu.fetch) {
			// nothing to see here
		} else {
			let url;
			switch (menu.key) {
				case "trips":
					url = `https://${config.apiDomain}/api/get/trips.php`;
					break;
				default:
					// do nothing
					break;
			}

			const response = await fetch(url);
			if (!response.ok) {
				// damn
			} else {
				let json = await response.json();
				let links = json.map(link => {
					let to;
					switch (menu.key) {
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

	let toggleMenu = details=>{
		sst_menuOpen(details.open);
		hideLogo(details.open); // hides the logo so it doesn't look squished when the menu is open
	}; // toggleMenu

	return (
		<Fragment>
			<Flex
				className={styles.navigation}
				gap="5"
				asChild
				hideBelow="sm"
			>
				<ul>
					{
						navigation.menus.map((menu, index) => {
							// console.log("menu",menu);
							return (
								<Box
									key={`${index}|${menu.key}|${menu.title}`}
									hideBelow={`${menu.hideBelow || null}`}
								>
									{
										menu.links ? (
											<li>
												<MenuRoot>
													<MenuTrigger asChild>
														<ChakraLink
															variant="underline"
															onMouseOver={event => handleFetch(menu)}
															onClick={event => handleFetch(menu)}
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
																			className={styles.navLink}
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
								</Box>
							);
						})
					}
				</ul>
			</Flex>

			<Box hideFrom="sm">
				<MenuRoot
					positioning={{ placement: "bottom-end" }}
					open={st_menuOpen}
					onOpenChange={toggleMenu}
				>
					<MenuTrigger
						asChild
						float="right"
					>
						<Button
							variant="subtle"
							size="sm"
							rounded="full"
						>
							<FaBars />
						</Button>
					</MenuTrigger>
					<MenuContent
						className={styles.mobileNav}
						borderColor={"{colors.teal.solid}"}
						borderRadius={"{radii.lg}"}
					>
						{
							navigation.menus.map((menu, index) => {
								if (!menu.links && menu.link) {
									return (
										<MenuItem key={`${menu.index}|${menu.title}`}>
											<Link
												variant="underline"
												to={menu.link}
												text={menu.title}
											/>
										</MenuItem>
									)
								} else if (menu.links) {
									return (
										<AccordionRoot collapsible key={`${menu.index}|${menu.title}`}>
											<AccordionItem value={menu.key}>
												<AccordionItemTrigger>
													<Flex
														as="span"
														align="center"
														justify="space-between"
														w="100%"
														cursor="pointer"
													>
														<ChakraLink
															variant="underline"
															onMouseOver={event => handleFetch(menu)}
															onClick={event => handleFetch(menu)}
														>
															{menu.title} 
														</ChakraLink>
														<Box
															as="span"
															className={styles.chevron}
														>
															<FaAngleDown />
														</Box>
													</Flex>
												</AccordionItemTrigger>

												<AccordionItemContent>
													<Box pl="4">
														{menu.links.map((link, index) => (
															<Link
																key={`${index}|${link.text}`}
																variant="underline"
																to={link.to}
																text={link.text}
																className={styles.navLink}
																onClick={()=>{
																	toggleMenu({open:false});
																}}
															/>
														))}
													</Box>
												</AccordionItemContent>
											</AccordionItem>
										</AccordionRoot>
									)
								}
							})
						}

					</MenuContent>
				</MenuRoot>
			</Box>
		</Fragment>
	);
};

export default Navigation;
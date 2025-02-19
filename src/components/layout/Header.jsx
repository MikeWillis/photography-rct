import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import {
	Box,
	Sticky,
	Grid,
	Flex,
} from "@chakra-ui/react";

import Navigation from "./Navigation";

import styles from "../../styles/header.module.scss";

const Header = props => {
	const [st_scrolled, sst_scrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			sst_scrolled(window.scrollY >= 1);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, []);

	return (
		<Box
			className={`${styles.header} ${(st_scrolled ? styles.scrolled : '')}`}
		>
			<Flex
				gap="3"
				direction="row"
				height="100%"
			>
				<Box width="225px">
					<NavLink to="/" end>
						<img
							className={styles.logo}
							src="https://images.mikewillisphotography.com/logos/MikeLogo_Transparent_Cropped.100.png"
							alt="Mike Willis Photography"
						/>
					</NavLink>
				</Box>
				<Box flex="1">
					<Navigation />
				</Box>
			</Flex>

		</Box>
	);
};

export default Header;
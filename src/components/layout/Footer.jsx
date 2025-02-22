import { Fragment } from "react";
import {
	Box,
	Text,
} from "@chakra-ui/react";

import Link from "../general/Link";

import { config } from "../../config";

import styles from "../../styles/footer.module.scss";
import generalStyles from "../../styles/general.module.scss";

let navLinks = [
	{ to: "/", text: "Home" },
	{ to: "/contact/", text: "Contact Me" },
	{ to: "/posts/5/about-me/", text: "About Me" },
];

const Footer = props => {
	return (
		<Box
			className={`${generalStyles.content100vw} ${generalStyles.content} ${styles.footer}`}
			paddingLeft={config.contentIndent}
			paddingRight={config.contentIndent}
			borderTopColor={"{colors.teal.fg}"}
		>
			<Text>&copy; Mike Willis Photography<br /></Text>

			<Box>
				{
					navLinks.map((link, index) => {
						return (
							<Fragment key={`fLinks|${index}|${link.to}`}>
								<Link
									variant="underline"
									to={link.to}
									text={link.text}
								/>
								{
									index < navLinks.length - 1 ? (
										<Text color={"{colors.teal.fg}"} display="inline">
											&nbsp;&nbsp;|&nbsp;&nbsp;
										</Text>
									) : ""
								}
							</Fragment>
						)
					})
				}
			</Box>

			<Text className={styles.googleCrap}>
				This site is protected by reCAPTCHA and the Google{" "}
				<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
				<a href="https://policies.google.com/terms">Terms of Service</a> apply.*<br /><br /><br />
				* Yep no one cares about that crap but google wanted me to put it here.
			</Text>
		</Box>
	);
};

export default Footer;
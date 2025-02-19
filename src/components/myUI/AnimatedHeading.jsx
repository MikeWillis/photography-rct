import { Heading } from "@chakra-ui/react";

import styles from "../../styles/animatedHeading.module.scss";
import { config } from "../../config";

const AnimatedHeading = props => {
	return (
		<Heading
			className={styles.textFocusIn}
			size={props.size || "5xl"}
			as={props.as || null}
			color={`${config.colorPalette}.fg`}
			marginLeft={props.marginLeft || config.contentIndent}
			marginRight={props.marginRight || config.contentIndent}
			marginBottom={props.marginBottom || null}
		>
			{props.heading}
		</Heading>
	)
};

export default AnimatedHeading;
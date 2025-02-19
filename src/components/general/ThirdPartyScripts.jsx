import { Fragment } from "react";

import { config } from "../../config";

const ThirdPartyScripts = props=>{
	return (
		<Fragment>
			<script src={`https://www.google.com/recaptcha/api.js?render=${config.recaptcha.siteKey}`} async defer></script>
		</Fragment>
	);
};

export default ThirdPartyScripts;
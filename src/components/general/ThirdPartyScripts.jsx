import { Fragment } from "react";

import { config } from "../../config";

const ThirdPartyScripts = props=>{
	// console.log("key",config.recaptcha.siteKey)
	return (
		<Fragment>
			<script src={`https://www.google.com/recaptcha/api.js?render=${config.recaptcha.siteKey}`} async></script>
		</Fragment>
	);
};

export default ThirdPartyScripts;
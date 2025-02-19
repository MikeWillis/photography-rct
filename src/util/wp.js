import { config } from "../config";

export const getPost = async id=>{
	const response = await fetch( `https://${config.apiDomain}${config.wpEndpoint}posts/${id}/` );
	if ( response.ok ) {
		let json = await response.json();
		return json;
	} else {
		return false;
	}
};

export const getAuthor = async id => {
	const response = await fetch( `https://${config.apiDomain}${config.wpEndpoint}users/${id}/` );
	if ( response.ok ) {
		let json = await response.json();
		return json;
	} else {
		return false;
	}
}; // getAuthor
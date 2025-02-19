// see https://stackoverflow.com/a/54470889/1042398
export const getAllCSSVariableNames = (styleSheets = document.styleSheets) => {
	var cssVars = [];
	// loop each stylesheet
	for (var i = 0; i < styleSheets.length; i++) {
		// loop stylesheet's cssRules
		try { // try/catch used because 'hasOwnProperty' doesn't work
			for (var j = 0; j < styleSheets[i].cssRules.length; j++) {
				try {
					// loop stylesheet's cssRules' style (property names)
					for (var k = 0; k < styleSheets[i].cssRules[j].style.length; k++) {
						let name = styleSheets[i].cssRules[j].style[k];
						// test name for css variable signiture and uniqueness
						if (name.startsWith('--') && cssVars.indexOf(name) == -1) {
							cssVars.push(name);
						}
					}
				} catch (error) { }
			}
		} catch (error) { }
	}
	return cssVars;
}; // getAllCSSVariableNames

// see https://stackoverflow.com/a/2450976/1042398
export const shuffleArray = ( arr ) => {
	let currentIndex = arr.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [ arr[randomIndex], arr[currentIndex] ];
  }
}; // shuffle

export const getFullMonth = month=>{
	let result;
	switch( month ) {
	case 0: result = "January"; break;
	case 1: result = "February"; break;
	case 2: result = "March"; break;
	case 3: result = "April"; break;
	case 4: result = "May"; break;
	case 5: result = "June"; break;
	case 6: result = "July"; break;
	case 7: result = "August"; break;
	case 8: result = "September"; break;
	case 9: result = "October"; break;
	case 10: result = "November"; break;
	case 11: result = "December"; break;
	}

	return result;
}; // getFullMonth
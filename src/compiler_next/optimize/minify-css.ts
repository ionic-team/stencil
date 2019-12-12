
export const minifyCss = (cssString: string) => {
  cssString = stripComments(cssString);
  cssString = stripWhitespaces(cssString);
  return cssString;
}

const stripWhitespaces = (cssString: string) => {
	return cssString
		.replace(/(^\s*)|\n/gm, '')
		.replace(/\s*([\{:,+\}])\s*/gm, '$1');
}

const stripComments = (cssString: string) => {
  let isInsideString = false;
  let stringCharacter = '';
	let currentCharacter = '';
  let returnValue = '';

	for (let i = 0; i < cssString.length; i++) {
		currentCharacter = cssString[i];

		if (cssString[i - 1] !== '\\') {
			if (currentCharacter === '"' || currentCharacter === '\'') {
				if (isInsideString && stringCharacter === currentCharacter) {
					isInsideString = false;
				} else if (!isInsideString) {
          isInsideString = true;
					stringCharacter = currentCharacter;
				}
			}
		}

		// Find beginning of `/*` type comment
		if (!isInsideString && currentCharacter === '/' && cssString[i + 1] === '*') {
			// Ignore important comment when configured to preserve comments using important syntax: /*!
			let j = i + 2;

			// Iterate over comment
			for (; j < cssString.length; j++) {
				// Find end of comment
				if (cssString[j] === '*' && cssString[j + 1] === '/') {
          if (cssString[j + 2] === '\n') {
            j++;
          } else if (cssString[j + 2] + cssString[j + 3] === '\r\n') {
            j += 2;
          }
					break;
				}
			}

			// Resume iteration over CSS string from the end of the comment
			i = j + 1;

			continue;
		}

		returnValue += currentCharacter;
	}

	return returnValue;
};

import { hasError } from '@utils';
import { parseCss } from '../../compiler/style/css-parser/parse-css';
import { serializeCss } from '../../compiler/style/css-parser/serialize-css';


export const minifyCss = (cssString: string) => {
	const parseResults = parseCss(cssString);

	if (hasError(parseResults.diagnostics)) {
		return cssString;
	}

	const output = serializeCss(parseResults.stylesheet, {});

	return output;
};

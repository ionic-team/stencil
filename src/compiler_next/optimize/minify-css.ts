import { hasError } from '@utils';
import { parseCss } from '../../compiler/style/parse-css';
import { StringifyCss } from '../../compiler/style/stringify-css';


export const minifyCss = (cssString: string) => {
	const cssAst = parseCss(cssString);

	if (hasError(cssAst.stylesheet.diagnostics)) {
		return cssString;
	}

	const output = new StringifyCss({
		removeTrailingSemicolon: true,
		removeWhitespace: true,
	});

	return output.compile(cssAst);
};

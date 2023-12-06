import { catchError, hasError } from '@utils';
import { parseCss } from '../style/css-parser/parse-css';
import { serializeCss } from '../style/css-parser/serialize-css';
import { getUsedSelectors } from '../style/css-parser/used-selectors';
export const removeUnusedStyles = (doc, diagnostics) => {
    try {
        const styleElms = doc.head.querySelectorAll(`style[data-styles]`);
        const styleLen = styleElms.length;
        if (styleLen > 0) {
            // pick out all of the selectors that are actually
            // being used in the html document
            const usedSelectors = getUsedSelectors(doc.documentElement);
            for (let i = 0; i < styleLen; i++) {
                removeUnusedStyleText(usedSelectors, diagnostics, styleElms[i]);
            }
        }
    }
    catch (e) {
        catchError(diagnostics, e);
    }
};
const removeUnusedStyleText = (usedSelectors, diagnostics, styleElm) => {
    try {
        // parse the css from being applied to the document
        const parseResults = parseCss(styleElm.innerHTML);
        diagnostics.push(...parseResults.diagnostics);
        if (hasError(diagnostics)) {
            return;
        }
        try {
            // convert the parsed css back into a string
            // but only keeping what was found in our active selectors
            styleElm.innerHTML = serializeCss(parseResults.stylesheet, {
                usedSelectors,
            });
        }
        catch (e) {
            diagnostics.push({
                level: 'warn',
                type: 'css',
                header: 'CSS Stringify',
                messageText: e,
                lines: [],
            });
        }
    }
    catch (e) {
        diagnostics.push({
            level: 'warn',
            type: 'css',
            header: 'CSS Parse',
            messageText: e,
            lines: [],
        });
    }
};
//# sourceMappingURL=remove-unused-styles.js.map
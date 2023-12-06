import { splitLineBreaks } from '@utils';
import { minify } from 'terser';
/**
 * Performs the minification of JavaScript source
 * @param input the JavaScript source to minify
 * @param opts the options used by the minifier
 * @returns the resulting minified JavaScript
 */
export const minifyJs = async (input, opts) => {
    const results = {
        output: input,
        sourceMap: null,
        diagnostics: [],
    };
    if (opts) {
        const mangle = opts.mangle;
        if (mangle) {
            const mangleProperties = mangle.properties;
            if (mangleProperties && mangleProperties.regex) {
                mangleProperties.regex = new RegExp(mangleProperties.regex);
            }
        }
        if (opts.sourceMap) {
            /**
             * sourceMap, when used in conjunction with compress, can lead to sourcemaps that don't in every browser. despite
             * there being a sourcemap spec, each browser has it's own tricks for trying to get sourcemaps to properly map
             * minified JS back to its original form. for the most consistent results across all browsers, explicitly disable
             * compress.
             */
            opts.compress = undefined;
        }
    }
    try {
        const minifyResults = await minify(input, opts);
        results.output = minifyResults.code;
        results.sourceMap = typeof minifyResults.map === 'string' ? JSON.parse(minifyResults.map) : minifyResults.map;
        const compress = opts.compress;
        if (compress && compress.module && results.output.endsWith('};')) {
            // stripping the semicolon here _shouldn't_ be of significant consequence for the already generated sourcemap
            results.output = results.output.substring(0, results.output.length - 1);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(e.stack);
        }
        loadMinifyJsDiagnostics(input, results.diagnostics, e);
    }
    return results;
};
const loadMinifyJsDiagnostics = (sourceText, diagnostics, error) => {
    const d = {
        level: 'error',
        type: 'build',
        language: 'javascript',
        header: 'Minify JS',
        code: '',
        messageText: error.message,
        absFilePath: undefined,
        relFilePath: undefined,
        lines: [],
    };
    const err = error;
    if (typeof err.line === 'number' && err.line > -1) {
        const srcLines = splitLineBreaks(sourceText);
        const errorLine = {
            lineIndex: err.line - 1,
            lineNumber: err.line,
            text: srcLines[err.line - 1],
            errorCharStart: err.col,
            errorLength: 0,
        };
        d.lineNumber = errorLine.lineNumber;
        d.columnNumber = errorLine.errorCharStart;
        const highlightLine = errorLine.text.slice(d.columnNumber);
        for (let i = 0; i < highlightLine.length; i++) {
            if (MINIFY_CHAR_BREAK.has(highlightLine.charAt(i))) {
                break;
            }
            errorLine.errorLength++;
        }
        d.lines.push(errorLine);
        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
            errorLine.errorLength = 1;
            errorLine.errorCharStart--;
        }
        if (errorLine.lineIndex > 0) {
            const previousLine = {
                lineIndex: errorLine.lineIndex - 1,
                lineNumber: errorLine.lineNumber - 1,
                text: srcLines[errorLine.lineIndex - 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.unshift(previousLine);
        }
        if (errorLine.lineIndex + 1 < srcLines.length) {
            const nextLine = {
                lineIndex: errorLine.lineIndex + 1,
                lineNumber: errorLine.lineNumber + 1,
                text: srcLines[errorLine.lineIndex + 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.push(nextLine);
        }
    }
    diagnostics.push(d);
};
const MINIFY_CHAR_BREAK = new Set([
    ' ',
    '=',
    '.',
    ',',
    '?',
    ':',
    ';',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '|',
    `'`,
    `"`,
    '`',
]);
//# sourceMappingURL=minify-js.js.map
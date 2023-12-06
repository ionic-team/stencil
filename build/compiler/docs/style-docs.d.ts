import type * as d from '../../declarations';
/**
 * Parse CSS docstrings that Stencil supports, as documented here:
 * https://stenciljs.com/docs/docs-json#css-variables
 *
 * Docstrings found in the supplied style text will be added to the
 * `styleDocs` param
 *
 * @param styleDocs the array to hold formatted CSS docstrings
 * @param styleText the CSS text we're working with
 */
export declare function parseStyleDocs(styleDocs: d.StyleDoc[], styleText: string | null): void;

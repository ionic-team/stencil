import type * as d from '../../../declarations';
/**
 * Converts a list of Shadow Parts metadata to a table written in Markdown
 * @param parts the Shadow parts metadata to convert
 * @returns a list of strings that make up the Markdown table
 */
export declare const partsToMarkdown: (parts: d.JsonDocsPart[]) => ReadonlyArray<string>;

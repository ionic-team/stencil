import type * as d from '../../../declarations';
/**
 * Converts a list of Slots metadata to a table written in Markdown
 * @param slots the Slots metadata to convert
 * @returns a list of strings that make up the Markdown table
 */
export declare const slotsToMarkdown: (slots: d.JsonDocsSlot[]) => ReadonlyArray<string>;

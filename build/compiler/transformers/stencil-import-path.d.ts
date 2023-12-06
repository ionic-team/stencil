import type { ParsedImport, SerializeImportData } from '../../declarations';
/**
 * Serialize data about a style import to an annotated path, where
 * the filename has a URL query params style string appended to it.
 * This could look like:
 *
 * ```
 * './some-file.CSS?tag=my-tag&mode=ios&encapsulation=scoped');
 * ```
 *
 * @param data import data to be serialized
 * @param styleImportData an argument which controls whether the import data
 * will be added to the path (formatted as query params)
 * @returns a formatted string
 */
export declare const serializeImportPath: (data: SerializeImportData, styleImportData: string | undefined | null) => string;
/**
 * Parse import paths (filepaths possibly annotated w/ component metadata,
 * formatted as URL query params) into a structured format.
 *
 * @param importPath an annotated import path to examine
 * @returns formatted information about the import
 */
export declare const parseImportPath: (importPath: string) => ParsedImport;

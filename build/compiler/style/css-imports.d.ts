import type * as d from '../../declarations';
/**
 * Parse CSS imports into an object which contains a manifest of imports and a
 * stylesheet with all imports resolved and concatenated.
 *
 * @param config the current config
 * @param compilerCtx the compiler context (we need filesystem access)
 * @param buildCtx the build context, we'll need access to diagnostics
 * @param srcFilePath the source filepath
 * @param resolvedFilePath the resolved filepath
 * @param styleText style text we start with
 * @param styleDocs optional array of style document objects
 * @returns an object with concatenated styleText and imports
 */
export declare const parseCssImports: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, srcFilePath: string, resolvedFilePath: string, styleText: string, styleDocs?: d.StyleDoc[]) => Promise<ParseCSSReturn>;
/**
 * Interface describing the return value of `parseCSSImports`
 */
interface ParseCSSReturn {
    /**
     * An array of filepaths to the imported CSS files
     */
    imports: string[];
    /**
     * The actual CSS text itself
     */
    styleText: string;
}
/**
 * Get a manifest of all the CSS imports in a given CSS file
 *
 * @param config the current config
 * @param compilerCtx the compiler context (we need the filesystem)
 * @param buildCtx the build context, in case we need to set a diagnostic
 * @param filePath the filepath we're working with
 * @param styleText the CSS for which we want to retrieve import data
 * @returns a Promise wrapping a list of CSS import data objects
 */
export declare const getCssImports: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, styleText: string) => Promise<d.CssImportData[]>;
export declare const isCssNodeModule: (url: string) => boolean;
export declare const resolveCssNodeModule: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], filePath: string, cssImportData: d.CssImportData) => Promise<void>;
export declare const isLocalCssImport: (srcImport: string) => boolean;
/**
 * Replace import declarations (like '@import "foobar";') with the actual CSS
 * written in the imported module, allowing us to produce a single file from a
 * tree of stylesheets.
 *
 * @param styleText the text within which we want to replace @import statements
 * @param cssImports information about imported modules
 * @param isCssEntry whether we're dealing with a CSS file
 * @returns an updated string with the requisite substitutions
 */
export declare const replaceImportDeclarations: (styleText: string, cssImports: d.CssImportData[], isCssEntry: boolean) => string;
export {};

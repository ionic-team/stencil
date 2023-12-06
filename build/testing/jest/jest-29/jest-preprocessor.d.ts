import type { TransformedSource, TransformOptions } from '@jest/transform';
export declare const jestPreprocessor: {
    /**
     * Transforms a file to CommonJS to be used by Jest. The API for `process` is described in the
     * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
     * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
     * reference, the v28 docs were referenced.
     *
     * @param sourceText the contents of the source file
     * @param sourcePath the path to the source file
     * @param options the transformation options to apply to each file
     * @returns the transformed file contents if the file should be transformed. returns the original source otherwise
     */
    process(sourceText: string, sourcePath: string, options: TransformOptions): TransformedSource;
    /**
     * Generates a key used to cache the results of transforming a file. This helps avoid re-processing a file via the
     * `transform` function unnecessarily (when no changes have occurred). The API for `getCacheKey` is described in the
     * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
     * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
     * reference, the v28 docs were referenced.
     *
     * @param sourceText the contents of the source file
     * @param sourcePath the path to the source file
     * @param options the transformation options to apply to each file
     * @returns the key to cache a file with
     */
    getCacheKey(sourceText: string, sourcePath: string, options: TransformOptions): string;
};
/**
 * Determines if a file should be transformed prior to being consumed by Jest, based on the file name and its contents
 * @param filePath the path of the file
 * @param sourceText the contents of the file
 * @returns `true` if the file should be transformed, `false` otherwise
 */
export declare function shouldTransform(filePath: string, sourceText: string): boolean;

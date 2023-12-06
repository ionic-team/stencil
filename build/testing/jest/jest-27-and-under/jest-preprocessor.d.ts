type Jest26CacheKeyOptions = {
    instrument: boolean;
    rootDir: string;
};
type Jest26Config = {
    instrument: boolean;
    rootDir: string;
};
type Jest27TransformOptions = {
    config: Jest26Config;
};
export declare const jestPreprocessor: {
    /**
     * Transforms a file to CommonJS to be used by Jest. The API for `process` is described in the
     * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
     * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
     * reference, the v27.2 docs were referenced (the most recent available).
     *
     * This function attempts to support several versions of Jest (v23 through v27). Support for earlier versions of Jest
     * will be removed in a future major version of Stencil.
     *
     * @param sourceText the contents of the source file
     * @param sourcePath the path to the source file
     * @param jestConfig the jest configuration when called by Jest 26 and lower. This parameter is folded into
     * `transformOptions` when called by Jest 27+ as a top level `config` property. Calls to this function from Jest 27+
     * will have a `Jest27TransformOptions` shape
     * @param transformOptions an object containing the various transformation options. In Jest 27+ this parameter occurs
     * third in this function signature (and no fourth parameter is formally accepted)
     * @returns the transformed file contents if the file should be transformed. returns the original source otherwise
     */
    process(sourceText: string, sourcePath: string, jestConfig: Jest26Config | Jest27TransformOptions, transformOptions?: Jest26Config): string;
    /**
     * Generates a key used to cache the results of transforming a file. This helps avoid re-processing a file via the
     * `transform` function unnecessarily (when no changes have occurred). The API for `getCacheKey` is described in the
     * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
     * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
     * reference, the v27.2 docs were referenced (the most recent available).
     *
     * This function attempts to support several versions of Jest (v23 through v27). Support for earlier versions of Jest
     * will be removed in a future major version of Stencil.
     *
     * @param sourceText the contents of the source file
     * @param sourcePath the path to the source file
     * @param jestConfigStr a stringified version of the jest configuration when called by Jest 26 and lower. This
     * parameter takes the shape of `transformOptions` when called by Jest 27+.
     * @param transformOptions an object containing the various transformation options. In Jest 27+ this parameter occurs
     * third in this function signature (and no fourth parameter is formally accepted)
     * @returns the key to cache a file with
     */
    getCacheKey(sourceText: string, sourcePath: string, jestConfigStr: string | Jest27TransformOptions, transformOptions?: Jest26CacheKeyOptions): string;
};
/**
 * Determines if a file should be transformed prior to being consumed by Jest, based on the file name and its contents
 * @param filePath the path of the file
 * @param sourceText the contents of the file
 * @returns `true` if the file should be transformed, `false` otherwise
 */
export declare function shouldTransform(filePath: string, sourceText: string): boolean;
export {};

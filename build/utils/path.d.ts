/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not
 * extended-length paths and don't contain any non-ascii characters.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 * @param path the Windows-based path to convert
 * @param relativize whether or not a relative path should have `./` prepended
 * @returns the converted path
 */
export declare const normalizePath: (path: string, relativize?: boolean) => string;
/**
 * Same as normalizePath(), expect it'll also strip any query strings
 * from the path name. So /dir/file.css?tag=cmp-a becomes /dir/file.css
 * @param p the path to normalize
 * @returns the normalized path, sans any query strings
 */
export declare const normalizeFsPath: (p: string) => string;
export declare const normalizeFsPathQuery: (importPath: string) => {
    filePath: string;
    ext: string;
    format: string;
};
/**
 * A wrapped version of node.js' {@link path.relative} which adds our custom
 * normalization logic. This solves the relative path between `from` and `to`!
 *
 * The calculation of the returned path follows that of Node's logic, with one exception - if the calculated path
 * results in an empty string, a string of length one with a period (`'.'`) is returned.
 *
 * @throws the underlying node.js function can throw if either path is not a
 * string
 * @param from the path where relative resolution starts
 * @param to the destination path
 * @returns the resolved relative path
 */
export declare function relative(from: string, to: string): string;
/**
 * A wrapped version of node.js' {@link path.join} which adds our custom
 * normalization logic. This joins all the arguments (path fragments) into a
 * single path.
 *
 * The calculation of the returned path follows that of Node's logic, with one exception - any trailing slashes will
 * be removed from the calculated path.
 *
 * @throws the underlying node function will throw if any argument is not a
 * string
 * @param paths the paths to join together
 * @returns a joined path!
 */
export declare function join(...paths: string[]): string;
/**
 * A wrapped version of node.js' {@link path.resolve} which adds our custom
 * normalization logic. This resolves a path to a given (relative or absolute)
 * path.
 *
 * @throws the underlying node function will throw if any argument is not a
 * string
 * @param paths a path or path fragments to resolve
 * @returns a resolved path!
 */
export declare function resolve(...paths: string[]): string;
/**
 * A wrapped version of node.js' {@link path.normalize} which adds our custom
 * normalization logic. This normalizes a path, de-duping repeated segment
 * separators and resolving `'..'` segments.
 *
 * @throws the underlying node function will throw if the argument is not a
 * string
 * @param toNormalize a path to normalize
 * @returns a normalized path!
 */
export declare function normalize(toNormalize: string): string;

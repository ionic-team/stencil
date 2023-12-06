/**
 * Determine if a stringified file path is a TypeScript declaration file based on the extension at the end of the path.
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.d.ts` (case-sensitive), `false` otherwise.
 */
export declare const isDtsFile: (p: string) => boolean;
/**
 * Determine if a stringified file path is a TypeScript file based on the extension at the end of the path. This
 * function does _not_ consider type declaration files (`.d.ts` files) to be TypeScript files.
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.ts` (case-sensitive) but does _not_ end in `.d.ts`, `false` otherwise.
 */
export declare const isTsFile: (p: string) => boolean;
/**
 * Determine if a stringified file path is a TSX file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.tsx` (case-sensitive), `false` otherwise.
 */
export declare const isTsxFile: (p: string) => boolean;
/**
 * Determine if a stringified file path is a JSX file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.jsx` (case-sensitive), `false` otherwise.
 */
export declare const isJsxFile: (p: string) => boolean;
/**
 * Determine if a stringified file path is a JavaScript file based on the extension at the end of the path
 * @param p the path to evaluate
 * @returns `true` if the path ends in `.js` (case-sensitive), `false` otherwise.
 */
export declare const isJsFile: (p: string) => boolean;
export declare const isCommonDirModuleFile: (p: string) => boolean;
export declare const setPackageVersion: (pkgVersions: Map<string, string>, pkgName: string, pkgVersion: string) => void;
export declare const setPackageVersionByContent: (pkgVersions: Map<string, string>, pkgContent: string) => void;
export declare const isLocalModule: (p: string) => boolean;
export declare const isStencilCoreImport: (p: string) => boolean;
export declare const isNodeModulePath: (p: string) => boolean;
export declare const getModuleId: (orgImport: string) => {
    moduleId: string;
    filePath: string;
    scope: string;
    scopeSubModuleId: string;
};
export declare const getPackageDirPath: (p: string, moduleId: string) => string;

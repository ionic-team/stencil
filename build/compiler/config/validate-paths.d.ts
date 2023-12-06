import type * as d from '../../declarations';
/**
 * The paths validated in this module. These fields can be incorporated into a
 * {@link d.ValidatedConfig} object.
 */
interface ConfigPaths {
    rootDir: string;
    srcDir: string;
    packageJsonFilePath: string;
    cacheDir: string;
    srcIndexHtml: string;
    globalScript?: string;
    globalStyle?: string;
    buildLogFilePath?: string;
}
/**
 * Do logical-level validation (as opposed to type-level validation)
 * for various properties in the user-supplied config which represent
 * filesystem paths.
 *
 * @param config a validated user-supplied configuration
 * @returns an object holding the validated paths
 */
export declare const validatePaths: (config: d.Config) => ConfigPaths;
export {};

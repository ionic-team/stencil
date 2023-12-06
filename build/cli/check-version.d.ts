import type { ValidatedConfig } from '../declarations';
/**
 * Retrieve a reference to the active `CompilerSystem`'s `checkVersion` function
 * @param config the Stencil configuration associated with the currently compiled project
 * @param currentVersion the Stencil compiler's version string
 * @returns a reference to `checkVersion`, or `null` if one does not exist on the current `CompilerSystem`
 */
export declare const startCheckVersion: (config: ValidatedConfig, currentVersion: string) => Promise<(() => void) | null>;
/**
 * Print the results of running the provided `versionChecker`.
 *
 * Does not print if no `versionChecker` is provided.
 *
 * @param versionChecker the function to invoke.
 */
export declare const printCheckVersionResults: (versionChecker: Promise<(() => void) | null>) => Promise<void>;

import { isFunction } from '@utils';
/**
 * Retrieve a reference to the active `CompilerSystem`'s `checkVersion` function
 * @param config the Stencil configuration associated with the currently compiled project
 * @param currentVersion the Stencil compiler's version string
 * @returns a reference to `checkVersion`, or `null` if one does not exist on the current `CompilerSystem`
 */
export const startCheckVersion = async (config, currentVersion) => {
    if (config.devMode && !config.flags.ci && !currentVersion.includes('-dev.') && isFunction(config.sys.checkVersion)) {
        return config.sys.checkVersion(config.logger, currentVersion);
    }
    return null;
};
/**
 * Print the results of running the provided `versionChecker`.
 *
 * Does not print if no `versionChecker` is provided.
 *
 * @param versionChecker the function to invoke.
 */
export const printCheckVersionResults = async (versionChecker) => {
    if (versionChecker) {
        const checkVersionResults = await versionChecker;
        if (isFunction(checkVersionResults)) {
            checkVersionResults();
        }
    }
};
//# sourceMappingURL=check-version.js.map
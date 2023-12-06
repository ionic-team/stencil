import { validateManifestJson } from '../html/validate-manifest-json';
import { validateBuildPackageJson } from '../types/validate-build-package-json';
/**
 * Validate the existence and contents of certain files that were generated after writing the results of the build to
 * disk
 * @param config the Stencil configuration used for the build
 * @param compilerCtx the compiler context associated with the build
 * @param buildCtx the build context associated with the current build
 * @returns an array containing empty-Promise results
 */
export const validateBuildFiles = (config, compilerCtx, buildCtx) => {
    if (buildCtx.hasError) {
        return null;
    }
    return Promise.all([
        validateBuildPackageJson(config, compilerCtx, buildCtx),
        validateManifestJson(config, compilerCtx, buildCtx),
    ]);
};
//# sourceMappingURL=validate-files.js.map
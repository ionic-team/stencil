import { isBoolean, isOutputTargetDistCollection } from '@utils';
import { getAbsolutePath } from '../config-utils';
/**
 * Validate and return DIST_COLLECTION output targets, ensuring that the `dir`
 * property is set on them.
 *
 * @param config a validated configuration object
 * @param userOutputs an array of output targets
 * @returns an array of validated DIST_COLLECTION output targets
 */
export const validateCollection = (config, userOutputs) => {
    return userOutputs.filter(isOutputTargetDistCollection).map((outputTarget) => {
        var _a;
        return {
            ...outputTarget,
            transformAliasedImportPaths: isBoolean(outputTarget.transformAliasedImportPaths)
                ? outputTarget.transformAliasedImportPaths
                : true,
            dir: getAbsolutePath(config, (_a = outputTarget.dir) !== null && _a !== void 0 ? _a : 'dist/collection'),
        };
    });
};
//# sourceMappingURL=validate-collection.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativePathPlugin = void 0;
/**
 * Plugin for resolving identifiers during the build process. This plugin externalizes resolved modules resolved via the
 * provided `moduleId`.
 * @param moduleId the name of the module to replace
 * @param relativePath the name of the module to replace `moduleId` with
 * @returns a rollup plugin with a build hook that externalizes a module
 */
function relativePathPlugin(moduleId, relativePath) {
    return {
        name: 'relativePathPlugin',
        /**
         * A rollup build hook for resolving identifiers. [Source](https://rollupjs.org/guide/en/#resolveid)
         * @param id the importee exactly as it is written in an import statement in the source code
         * @returns an object that resolves an import to a different id (`relativePath`) while excluding it from the bundle
         * at the same time
         */
        resolveId(id) {
            if (id === moduleId) {
                return {
                    id: relativePath,
                    external: true,
                };
            }
            return null;
        },
    };
}
exports.relativePathPlugin = relativePathPlugin;

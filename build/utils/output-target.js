import { flatOne, normalizePath, sortBy } from '@utils';
import { join } from '@utils';
import { basename, dirname, relative } from 'path';
import { COPY, CUSTOM, DIST, DIST_COLLECTION, DIST_CUSTOM_ELEMENTS, DIST_GLOBAL_STYLES, DIST_HYDRATE_SCRIPT, DIST_LAZY, DIST_LAZY_LOADER, DIST_TYPES, DOCS_CUSTOM, DOCS_JSON, DOCS_README, DOCS_VSCODE, GENERATED_DTS, STATS, VALID_CONFIG_OUTPUT_TARGETS, WWW, } from './constants';
export const relativeImport = (pathFrom, pathTo, ext, addPrefix = true) => {
    let relativePath = relative(dirname(pathFrom), dirname(pathTo));
    if (addPrefix) {
        if (relativePath === '') {
            relativePath = '.';
        }
        else if (relativePath[0] !== '.') {
            relativePath = './' + relativePath;
        }
    }
    return normalizePath(`${relativePath}/${basename(pathTo, ext)}`);
};
export const getComponentsDtsSrcFilePath = (config) => join(config.srcDir, GENERATED_DTS);
/**
 * Helper to get an appropriate file path for `components.d.ts` for a `"dist"`
 * or `"dist-types"` output target.
 *
 * @param outputTarget the output target of interest
 * @returns a properly-formatted path
 */
export const getComponentsDtsTypesFilePath = (outputTarget) => join(outputTarget.typesDir, GENERATED_DTS);
export const isOutputTargetDist = (o) => o.type === DIST;
export const isOutputTargetDistCollection = (o) => o.type === DIST_COLLECTION;
export const isOutputTargetDistCustomElements = (o) => o.type === DIST_CUSTOM_ELEMENTS;
export const isOutputTargetCopy = (o) => o.type === COPY;
export const isOutputTargetDistLazy = (o) => o.type === DIST_LAZY;
export const isOutputTargetDistLazyLoader = (o) => o.type === DIST_LAZY_LOADER;
export const isOutputTargetDistGlobalStyles = (o) => o.type === DIST_GLOBAL_STYLES;
export const isOutputTargetHydrate = (o) => o.type === DIST_HYDRATE_SCRIPT;
export const isOutputTargetCustom = (o) => o.type === CUSTOM;
export const isOutputTargetDocs = (o) => o.type === DOCS_README || o.type === DOCS_JSON || o.type === DOCS_CUSTOM || o.type === DOCS_VSCODE;
export const isOutputTargetDocsReadme = (o) => o.type === DOCS_README;
export const isOutputTargetDocsJson = (o) => o.type === DOCS_JSON;
export const isOutputTargetDocsCustom = (o) => o.type === DOCS_CUSTOM;
export const isOutputTargetDocsVscode = (o) => o.type === DOCS_VSCODE;
export const isOutputTargetWww = (o) => o.type === WWW;
export const isOutputTargetStats = (o) => o.type === STATS;
export const isOutputTargetDistTypes = (o) => o.type === DIST_TYPES;
/**
 * Checks whether or not the supplied output target's type matches one of the eligible primary
 * package output target types (i.e. it can have `isPrimaryPackageOutputTarget: true` in its config).
 *
 * @param o The output target to check.
 * @returns Whether the output target type is one of the "primary" output targets.
 */
export const isEligiblePrimaryPackageOutputTarget = (o) => isOutputTargetDist(o) ||
    isOutputTargetDistCollection(o) ||
    isOutputTargetDistCustomElements(o) ||
    isOutputTargetDistTypes(o);
/**
 * Retrieve the Stencil component compiler metadata from a collection of Stencil {@link Module}s
 * @param moduleFiles the collection of `Module`s to retrieve the metadata from
 * @returns the metadata, lexicographically sorted by the tag names of the components
 */
export const getComponentsFromModules = (moduleFiles) => sortBy(flatOne(moduleFiles.map((m) => m.cmps)), (c) => c.tagName);
/**
 * Check whether a given output target is a valid one to be set in a Stencil config
 *
 * @param targetType the type which we want to check
 * @returns whether or not the targetType is a valid, configurable output target.
 */
export function isValidConfigOutputTarget(targetType) {
    // unfortunately `includes` is typed on `ReadonlyArray<T>` as `(el: T):
    // boolean` so a `string` cannot be passed to `includes` on a
    // `ReadonlyArray` 😢 thus we `as any`
    //
    // see microsoft/TypeScript#31018 for some discussion of this
    return VALID_CONFIG_OUTPUT_TARGETS.includes(targetType);
}
//# sourceMappingURL=output-target.js.map
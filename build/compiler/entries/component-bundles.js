import { sortBy } from '@utils';
import { getDefaultBundles } from './default-bundles';
/**
 * Generate a list of all component tags that will be used by the output
 *
 * If the user has set the {@link d.Config.excludeUnusedDependencies} option
 * to `false` then this simply returns all components.
 *
 * Else, this takes {@link d.ComponentCompilerMeta} objects which are being
 * used in the current output and then ensures that all used components as well
 * as their dependencies are present.
 *
 * @param config the Stencil configuration used for the build
 * @param defaultBundles metadata of the assumed components being used/bundled
 * @param allCmps all known components
 * @returns a set of all component tags that are used
 */
function computeUsedComponents(config, defaultBundles, allCmps) {
    if (!config.excludeUnusedDependencies) {
        // the user/config has specified that Stencil should use all the dependencies it's found, return the set of all
        // known tags
        return new Set(allCmps.map((c) => c.tagName));
    }
    const usedComponents = new Set();
    // All components
    defaultBundles.forEach((entry) => {
        entry.forEach((cmp) => usedComponents.add(cmp.tagName));
    });
    allCmps.forEach((cmp) => {
        if (!cmp.isCollectionDependency) {
            usedComponents.add(cmp.tagName);
        }
    });
    allCmps.forEach((cmp) => {
        if (cmp.isCollectionDependency) {
            if (cmp.dependents.some((dep) => usedComponents.has(dep))) {
                usedComponents.add(cmp.tagName);
            }
        }
    });
    return usedComponents;
}
/**
 * Generate the bundles that will be used during the bundling process
 *
 * This gathers information about all of the components used in the build,
 * including the bundles which will be included by default, and then returns a
 * deduplicated list of all the bundles which need to be present.
 *
 * @param config the Stencil configuration used for the build
 * @param buildCtx the current build context
 * @returns the bundles to be used during the bundling process
 */
export function generateComponentBundles(config, buildCtx) {
    const components = sortBy(buildCtx.components, (cmp) => cmp.dependents.length);
    const defaultBundles = getDefaultBundles(config, buildCtx, components);
    // this is most likely all the components
    const usedComponents = computeUsedComponents(config, defaultBundles, components);
    if (config.devMode) {
        // return only components used in the build
        return components
            .filter((c) => usedComponents.has(c.tagName))
            .map((cmp) => [cmp]);
    }
    // Visit components that are already in one of the default bundles
    const alreadyBundled = new Set();
    defaultBundles.forEach((entry) => {
        entry.forEach((cmp) => alreadyBundled.add(cmp));
    });
    const bundlers = components
        .filter((cmp) => usedComponents.has(cmp.tagName) && !alreadyBundled.has(cmp))
        .map((c) => [c]);
    return [...defaultBundles, ...optimizeBundlers(bundlers, 0.6)].filter((b) => b.length > 0);
}
/**
 * Calculate and reorganize bundles based on a calculated similarity score between bundle entries
 * @param bundles the bundles to reorganize
 * @param threshold a numeric value used to determine whether or not bundles should be reorganized
 * @returns the reorganized bundles
 */
function optimizeBundlers(bundles, threshold) {
    /**
     * build a mapping of component tag names in each `bundles` entry to the index where that entry occurs in `bundles`:
     * ```ts
     * bundles = [
     *   [
     *     {
     *       tagName: 'my-foo', ...<other_fields>,
     *     },
     *   ],
     *   [
     *     {
     *       tagName: 'my-bar', ...<other_fields>,
     *     },
     *     {
     *       tagName: 'my-baz', ...<other_fields>,
     *     },
     *   ],
     * ];
     * // yields
     * {
     *   'my-foo': 0,
     *   'my-bar': 1,
     *   'my-baz': 1,
     * }
     * ```
     * note that in the event of a component being found >1 time, store the index of the last entry in which it's found
     */
    const cmpIndexMap = new Map();
    bundles.forEach((entry, index) => {
        entry.forEach((cmp) => {
            cmpIndexMap.set(cmp.tagName, index);
        });
    });
    // build a record of components
    const matrix = bundles.map((entry) => {
        const vector = new Uint8Array(bundles.length);
        entry.forEach((cmp) => {
            // for each dependent of a component, check to see if the dependent has been seen already when the `cmpIndexMap`
            // was originally built. If so, mark it with a '1'
            cmp.dependents.forEach((tag) => {
                const index = cmpIndexMap.get(tag);
                if (index !== undefined) {
                    vector[index] = 1;
                }
            });
        });
        entry.forEach((cmp) => {
            // for each entry, check to see if the component has been seen already when the `cmpIndexMap` was originally
            // built. If so, mark it with a '0', potentially overriding a previously set value on the vector.
            const index = cmpIndexMap.get(cmp.tagName);
            if (index !== undefined) {
                vector[index] = 0;
            }
        });
        return vector;
    });
    // resolve similar components
    const newBundles = [];
    const visited = new Uint8Array(bundles.length);
    for (let i = 0; i < matrix.length; i++) {
        // check if bundle is visited (0 means it's not)
        if (visited[i] === 0) {
            const bundle = [...bundles[i]];
            visited[i] = 1;
            for (let j = i + 1; j < matrix.length; j++) {
                if (visited[j] === 0 && computeScore(matrix[i], matrix[j]) >= threshold) {
                    bundle.push(...bundles[j]);
                    visited[j] = 1;
                }
            }
            newBundles.push(bundle);
        }
    }
    return newBundles;
}
/**
 * Computes a 'score' between two arrays, that is defined as the number of times that the value at a given index is the
 * same in both arrays divided by the number of times the value in either array is high at the given index.
 * @param m0 the first array to calculate sameness with
 * @param m1 the second array to calculate sameness with
 * @returns the calculated score
 */
function computeScore(m0, m1) {
    let total = 0;
    let match = 0;
    for (let i = 0; i < m0.length; i++) {
        if (m0[i] === 1 || m1[i] === 1) {
            total++;
            if (m0[i] === m1[i]) {
                match++;
            }
        }
    }
    return match / total;
}
//# sourceMappingURL=component-bundles.js.map
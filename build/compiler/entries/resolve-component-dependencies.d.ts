import type * as d from '../../declarations';
/**
 * For each entry in the provided collection of compiler metadata, generate several lists:
 * - dependencies that the component has (both directly and indirectly/transitively)
 * - dependencies that the component has (only directly)
 * - components that are dependent on a particular component (both directly and indirectly/transitively)
 * - components that are dependent on a particular component (only directly)
 *
 * This information is stored directly on each entry in the provided collection
 *
 * @param cmps the compiler metadata of the components whose dependencies and dependents ought to be calculated
 */
export declare function resolveComponentDependencies(cmps: d.ComponentCompilerMeta[]): void;

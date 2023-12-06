import type * as d from '../../../declarations';
/**
 * Get build conditions appropriate for the `dist-custom-elements` Output
 * Target, including disabling lazy loading and hydration.
 *
 * @param config a validated user-supplied config
 * @param cmps metadata about the components currently being compiled
 * @returns build conditionals appropriate for the `dist-custom-elements` OT
 */
export declare const getCustomElementsBuildConditionals: (config: d.ValidatedConfig, cmps: d.ComponentCompilerMeta[]) => d.BuildConditionals;

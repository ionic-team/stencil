import type * as d from '../../../declarations';
/**
 * Validate and return DIST_COLLECTION output targets, ensuring that the `dir`
 * property is set on them.
 *
 * @param config a validated configuration object
 * @param userOutputs an array of output targets
 * @returns an array of validated DIST_COLLECTION output targets
 */
export declare const validateCollection: (config: d.ValidatedConfig, userOutputs: d.OutputTarget[]) => d.OutputTargetDistCollection[];

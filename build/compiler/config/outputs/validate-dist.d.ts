import type * as d from '../../../declarations';
/**
 * Validate that the "dist" output targets are valid and ready to go.
 *
 * This function will also add in additional output targets to its output, based on the input supplied.
 *
 * @param config the compiler config, what else?
 * @param userOutputs a user-supplied list of output targets.
 * @returns a list of OutputTargets which have been validated for us.
 */
export declare const validateDist: (config: d.ValidatedConfig, userOutputs: d.OutputTarget[]) => d.OutputTarget[];

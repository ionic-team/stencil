import type * as d from '../../declarations';
/**
 * Get the path to the build directory where files written for the `www` output
 * target should be written.
 *
 * @param outputTarget a www output target of interest
 * @returns a path to the build directory for that output target
 */
export declare const getAbsoluteBuildDir: (outputTarget: d.OutputTargetWww) => string;

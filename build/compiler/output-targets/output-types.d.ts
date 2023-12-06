import type * as d from '../../declarations';
/**
 * Entrypoint for generating types for all output targets
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 */
export declare const outputTypes: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;

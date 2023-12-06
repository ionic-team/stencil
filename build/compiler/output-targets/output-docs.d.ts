import type * as d from '../../declarations';
/**
 * Generate documentation-related output targets
 * @param config the configuration associated with the current Stencil task run
 * @param compilerCtx the current compiler context
 * @param buildCtx the build context for the current Stencil task run
 */
export declare const outputDocs: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;

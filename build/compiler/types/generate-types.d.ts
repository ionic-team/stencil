import type * as d from '../../declarations';
/**
 * For a single output target, generate types, then copy the Stencil core type declaration file
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param outputTarget the output target to generate types for
 */
export declare const generateTypes: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistTypes) => Promise<void>;

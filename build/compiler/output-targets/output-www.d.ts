import type * as d from '../../declarations';
/**
 * Run a {@link d.OutputTargetWww} build. This involves generating `index.html`
 * for the build which imports the output of the lazy build and also generating
 * a host configuration record.
 *
 * @param config the current user-supplied config
 * @param compilerCtx a compiler context
 * @param buildCtx a build context
 */
export declare const outputWww: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;

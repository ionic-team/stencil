import type { Plugin } from 'rollup';
import type * as d from '../../declarations';
/**
 * A Rollup plugin which bundles application data.
 *
 * @param config the Stencil configuration for a particular project
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param build the set build conditionals for the build
 * @param platform the platform that is being built
 * @returns a Rollup plugin which carries out the necessary work
 */
export declare const appDataPlugin: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.BuildConditionals, platform: 'client' | 'hydrate' | 'worker') => Plugin;
export declare const getGlobalScriptData: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => GlobalScript[];
interface GlobalScript {
    defaultName: string;
    path: string;
}
export {};

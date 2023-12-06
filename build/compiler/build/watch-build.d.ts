import type * as d from '../../declarations';
/**
 * This method contains context and functionality for a TS watch build. This is called via
 * the compiler when running a build in watch mode (i.e. `stencil build --watch`).
 *
 * In essence, this method tracks all files that change while the program is running to trigger
 * a rebuild of a Stencil project using a {@link ts.EmitAndSemanticDiagnosticsBuilderProgram}.
 *
 * @param config The validated config for the Stencil project
 * @param compilerCtx The compiler context for the project
 * @returns An object containing helper methods for the dev-server's watch program
 */
export declare const createWatchBuild: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => Promise<d.CompilerWatcher>;

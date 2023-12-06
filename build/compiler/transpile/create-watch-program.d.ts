import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * This method creates the {@link ts.EmitAndSemanticDiagnosticsBuilderProgram} that is responsible for
 * rebuilding a Stencil project after file changes have been detected (via TS's polling-based file watcher).
 *
 * We mostly use a traditional approach to create the program as documented by the TS team:
 * {@link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#writing-an-incremental-program-watcher}
 * However, we do override a few methods on the {@link ts.System} object.
 *
 * @param config The validated config for the Stencil project.
 * @param buildCallback A function that will be executed after the TS program is created and on subsequent
 * project rebuilds.
 * @returns An object containing the {@link ts.EmitAndSemanticDiagnosticsBuilderProgram} and callback
 * function to trigger a project rebuild.
 */
export declare const createTsWatchProgram: (config: d.ValidatedConfig, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => Promise<{
    program: ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>;
    rebuild: () => void;
}>;

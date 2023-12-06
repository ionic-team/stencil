import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Create a TypeScript Program ({@link ts.Program}) to perform builds of a Stencil project using the provided
 * `buildCallback` entity
 * @param config a Stencil configuration to apply to a full build of a Stencil project
 * @param buildCallback a callback that invokes the actual transpilation of a Stencil project
 * @returns a Program that marries the TypeScript and Stencil compilers together.
 */
export declare const createTsBuildProgram: (config: d.ValidatedConfig, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => Promise<ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>>;

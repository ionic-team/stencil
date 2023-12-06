import ts from 'typescript';
import type * as d from '../../declarations';
export declare const build: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => Promise<d.CompilerBuildResults>;

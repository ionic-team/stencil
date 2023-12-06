import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const updateModule: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsSourceFile: ts.SourceFile, sourceFileText: string, emitFilePath: string, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta) => d.Module;

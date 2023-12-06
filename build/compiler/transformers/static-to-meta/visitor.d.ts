import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const convertStaticToMeta: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta, transformOpts: d.TransformOptions) => ts.TransformerFactory<ts.SourceFile>;

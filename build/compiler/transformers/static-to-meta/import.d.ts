import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const parseModuleImport: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, dirPath: string, importNode: ts.ImportDeclaration, resolveCollections: boolean) => void;

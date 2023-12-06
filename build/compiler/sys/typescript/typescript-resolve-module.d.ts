import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const tsResolveModuleName: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, moduleName: string, containingFile: string) => ts.ResolvedModuleWithFailedLookupLocations;
export declare const tsResolveModuleNamePackageJsonPath: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, moduleName: string, containingFile: string) => string;
export declare const ensureExtension: (fileName: string, containingFile: string) => string;

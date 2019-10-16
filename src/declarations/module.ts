import { ComponentCompilerMeta } from './component-compiler-meta';
import ts from 'typescript';


export type ModuleMap = Map<string, Module>;

/**
 * Module gets serialized/parsed as JSON
 * cannot use Map or Set
 */
export interface Module {
  cmps: ComponentCompilerMeta[];
  coreRuntimeApis: string[];
  collectionName: string;
  dtsFilePath: string;
  excludeFromCollection: boolean;
  externalImports: string[];
  htmlAttrNames: string[];
  htmlTagNames: string[];
  isCollectionDependency: boolean;
  isLegacy: boolean;
  jsFilePath: string;
  localImports: string[];
  originalImports: string[];
  originalCollectionComponentPath: string;
  potentialCmpRefs: string[];
  sourceFilePath: string;
  staticSourceFile: ts.SourceFile;
  staticSourceFileText: string;

  // build features
  hasVdomAttribute: boolean;
  hasVdomXlink: boolean;
  hasVdomClass: boolean;
  hasVdomFunctional: boolean;
  hasVdomKey: boolean;
  hasVdomListener: boolean;
  hasVdomRef: boolean;
  hasVdomRender: boolean;
  hasVdomStyle: boolean;
  hasVdomText: boolean;
}

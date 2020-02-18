import { ComponentCompilerMeta } from './component-compiler-meta';


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

  // build features
  hasVdomAttribute: boolean;
  hasVdomClass: boolean;
  hasVdomFunctional: boolean;
  hasVdomKey: boolean;
  hasVdomListener: boolean;
  hasVdomPropOrAttr: boolean;
  hasVdomRef: boolean;
  hasVdomRender: boolean;
  hasVdomStyle: boolean;
  hasVdomText: boolean;
  hasVdomXlink: boolean;
}

import * as d from '.';


export type ModuleMap = Map<string, Module>;


export interface Module {
  cmpCompilerMeta: d.ComponentCompilerMeta;
  collectionName: string;
  dtsFilePath: string;
  excludeFromCollection: boolean;
  externalImports: string[];
  hasVdomAttribute: boolean;
  hasVdomClass: boolean;
  hasVdomFunctional: boolean;
  hasVdomKey: boolean;
  hasVdomListener: boolean;
  hasVdomRef: boolean;
  hasVdomRender: boolean;
  hasVdomStyle: boolean;
  hasVdomText: boolean;
  htmlAttrNames: Set<string>;
  htmlTagNames: Set<string>;
  isCollectionDependency: boolean;
  jsFilePath: string;
  localImports: string[];
  originalCollectionComponentPath: string;
  potentialCmpRefs: d.PotentialComponentRef[];
  sourceFilePath: string;

  reset(): void;
}

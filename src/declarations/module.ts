import * as d from '.';


export type ModuleMap = Map<string, Module>;


export interface Module {
  sourceFilePath: string;
  jsFilePath?: string;
  dtsFilePath?: string;
  cmpCompilerMeta?: d.ComponentCompilerMeta;
  isCollectionDependency?: boolean;
  collectionName?: string;
  excludeFromCollection?: boolean;
  originalCollectionComponentPath?: string;
  externalImports?: string[];
  localImports?: string[];
  potentialCmpRefs?: d.PotentialComponentRef[];
  hasSlot?: boolean;
  hasSvg?: boolean;
  hasVdomRender?: boolean;
  hasVdomAttribute?: boolean;
  hasVdomClass?: boolean;
  hasVdomFunctional?: boolean;
  hasVdomKey?: boolean;
  hasVdomListener?: boolean;
  hasVdomRef?: boolean;
  hasVdomStyle?: boolean;
  hasVdomText?: boolean;
}

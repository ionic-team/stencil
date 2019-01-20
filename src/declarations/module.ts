import * as d from '.';


export type ModuleMap = Map<string, Module>;

/**
 * Module gets serialized/parsed as JSON
 * cannot use Map or Set
 */
export interface Module {
  cmps: d.ComponentCompilerMeta[];
  collectionName: string;
  dtsFilePath: string;
  excludeFromCollection: boolean;
  externalImports: string[];
  isCollectionDependency: boolean;
  jsFilePath: string;
  localImports: string[];
  originalCollectionComponentPath: string;
  sourceFilePath: string;
}

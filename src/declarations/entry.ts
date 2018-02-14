import * as d from './index';


export interface EntryModule {
  entryKey?: string;
  dependencies?: string[];
  moduleFiles: d.ModuleFile[];
  compiledModuleJsText?: string;
  compiledModuleLegacyJsText?: string;
  requiresScopedStyles?: boolean;
  modeNames?: string[];
  entryBundles?: EntryBundle[];
}

export interface EntryBundle {
  fileName: string;
  text: string;
  outputs: string[];
  modeName: string;
  isScopedStyles: boolean;
  sourceTarget: string;
}

export type EntryPoint = EntryComponent[];

export interface EntryComponent {
  tag: string;
  dependencyOf?: string[];
}

export interface ComponentRef {
  tag: string;
  filePath: string;
}

export interface PotentialComponentRef {
  tag?: string;
  html?: string;
  filePath: string;
}

export interface ModuleGraph {
  filePath: string;
  importPaths: string[];
}

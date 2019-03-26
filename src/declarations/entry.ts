import * as d from '.';


export interface EntryModule {
  entryKey?: string;
  dependencies?: string[];
  cmps: d.ComponentCompilerMeta[];
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

export type EntryPoint = d.ComponentCompilerMeta[];

export interface EntryComponent {
  tag: string;
  dependencyOf?: string[];
}

export interface ComponentRef {
  tag: string;
  filePath: string;
}

export interface ModuleGraph {
  filePath: string;
  importPaths: string[];
}

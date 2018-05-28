import * as d from './index';


export interface BuildCtx {
  graphData?: GraphData;
  componentRefs?: d.PotentialComponentRef[];
  moduleGraphs?: d.ModuleGraph[];
  collections?: d.Collection[];
  buildId: number;
  requiresFullBuild: boolean;
  diagnostics: d.Diagnostic[];
  entryModules: d.EntryModule[];
  entryPoints: d.EntryPoint[];
  global?: d.ModuleFile;
  transpileBuildCount: number;
  bundleBuildCount: number;
  appFileBuildCount: number;
  indexBuildCount: number;
  components: string[];
  aborted: boolean;
  timeSpan: d.LoggerTimeSpan;
  startTime: number;
  hasChangedJsText: boolean;
  filesWritten: string[];
  filesDeleted: string[];
  dirsDeleted: string[];
  dirsAdded: string[];
  filesChanged: string[];
  filesUpdated: string[];
  filesAdded: string[];
  shouldAbort?(): boolean;
  data?: any;
  hasSlot?: boolean;
  hasSvg?: boolean;
  finish?(): Promise<BuildResults>;
}


export type GraphData = Map<string, string[]>;


export interface BuildResults {
  buildId: number;
  diagnostics: d.Diagnostic[];
  hasError: boolean;
  aborted?: boolean;
  duration: number;
  isRebuild: boolean;
  transpileBuildCount: number;
  bundleBuildCount: number;
  hasChangedJsText: boolean;
  dirsAdded: string[];
  dirsDeleted: string[];
  filesWritten: string[];
  filesChanged: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
  components: BuildComponent[];
  entries: BuildEntry[];
  hasSlot: boolean;
  hasSvg: boolean;
}


export interface BuildStats {
  compiler: {
    name: string;
    version: string;
  };
  app: {
    namespace: string;
    fsNamespace: string;
    components: number;
    entries: number;
    bundles: number;
  };
  options: {
    minifyJs: boolean;
    minifyCss: boolean;
    hashFileNames: boolean;
    hashedFileNameLength: number;
    buildEs5: boolean;
  };
  components: BuildComponent[];
  entries: BuildEntry[];
  sourceGraph: BuildSourceGraph;
  collections: {
    name: string;
    source: string;
    tags: string[];
  }[];
}


export interface BuildEntry {
  entryId: string;
  components: BuildComponent[];
  bundles: BuildBundle[];
  inputs: string[];
  modes?: string[];
  encapsulations: string[];
}


export interface BuildBundle {
  fileName: string;
  outputs: string[];
  size?: number;
  gzip?: number;
  mode?: string;
  scopedStyles?: boolean;
  target?: string;
}


export interface BuildSourceGraph {
  [filePath: string]: string[];
}


export interface BuildComponent {
  tag: string;
  dependencyOf?: string[];
  dependencies?: string[];
}


export interface FilesMap {
  [filePath: string]: string;
}


export type CompilerEventName = 'fileUpdate' | 'fileAdd' | 'fileDelete' | 'dirAdd' | 'dirDelete' | 'build' | 'rebuild';

export interface TranspileResults {
  code?: string;
  diagnostics?: d.Diagnostic[];
  cmpMeta?: d.ComponentMeta;
}


export interface JSModuleList {
  [key: string]: { code: string };
}

export interface JSModuleMap {
  esm?: JSModuleList;
  es5?: JSModuleList;
  esmEs5?: JSModuleList;
}


export type SourceTarget = 'es5' | 'es2017';

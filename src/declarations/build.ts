import * as d from './index';


export interface BuildCtx {
  appFileBuildCount: number;
  buildId: number;
  buildResults: d.BuildResults;
  timestamp: string;
  bundleBuildCount: number;
  collections: d.Collection[];
  components: string[];
  createTimeSpan(msg: string, debug?: boolean): d.LoggerTimeSpan;
  data: any;
  diagnostics: d.Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  entryModules: d.EntryModule[];
  entryPoints: d.EntryPoint[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  finish(): Promise<BuildResults>;
  global: d.ModuleFile;
  graphData: GraphData;
  hasCopyChanges: boolean;
  hasFinished: boolean;
  hasIndexHtmlChanges: boolean;
  hasScriptChanges: boolean;
  hasSlot: boolean;
  hasStyleChanges: boolean;
  hasSvg: boolean;
  indexBuildCount: number;
  isActiveBuild: boolean;
  isRebuild: boolean;
  requiresFullBuild: boolean;
  shouldAbort(): boolean;
  startTime: number;
  styleBuildCount: number;
  stylesUpdated: { [styleId: string]: string };
  timeSpan: d.LoggerTimeSpan;
  transpileBuildCount: number;
  validateTypesHandler?: (results: d.ValidateTypesResults) => void;
  validateTypesPromise?: Promise<d.ValidateTypesResults>;
  validateTypesBuild?(): Promise<void>;
}


export type GraphData = Map<string, string[]>;

export interface BuildResults {
  buildId: number;
  bundleBuildCount: number;
  components: BuildComponent[];
  diagnostics: d.Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  duration: number;
  entries: BuildEntry[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  hasError: boolean;
  hasSuccessfulBuild: boolean;
  hasSlot: boolean;
  hasSvg: boolean;
  hmr?: HotModuleReplacement;
  isRebuild: boolean;
  styleBuildCount: number;
  transpileBuildCount: number;
}


export interface HotModuleReplacement {
  componentsUpdated?: string[];
  externalStylesUpdated?: string[];
  imagesUpdated?: string[];
  indexHtmlUpdated?: boolean;
  inlineStylesUpdated?: HmrStylesUpdate;
  versionId?: string;
  windowReload?: boolean;
}


export interface HmrStylesUpdate {
  [styleId: string]: string;
}


export interface BuildStartData {
  buildId: number;
  isRebuild: boolean;
  startTime: number;
  dirsAdded: string[];
  dirsDeleted: string[];
  filesChanged: string[];
  filesUpdated: string[];
  filesAdded: string[];
  filesDeleted: string[];
}

export interface BuildNoChangeResults {
  noChange: boolean;
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


export type CompilerEventName = 'fileUpdate' | 'fileAdd' | 'fileDelete' | 'dirAdd' | 'dirDelete' | 'buildStart' | 'buildFinish' | 'build' | 'buildNoChange';


export interface JSModuleList {
  [key: string]: { code: string };
}

export interface JSModuleMap {
  esm?: JSModuleList;
  es5?: JSModuleList;
  esmEs5?: JSModuleList;
}


export type SourceTarget = 'es5' | 'es2017';

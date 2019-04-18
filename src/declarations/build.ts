import * as d from '.';

export type ModuleFormat =
  | 'amd'
  | 'cjs'
  | 'commonjs'
  | 'es'
  | 'esm'
  | 'iife'
  | 'module'
  | 'system'
  | 'umd';

export interface RollupResultModule {
  id: string;
}
export interface RollupResults {
  modules: RollupResultModule[];
}

export interface BuildCtx {
  abort(): Promise<BuildResults>;
  appFileBuildCount: number;
  buildId: number;
  buildResults: d.BuildResults;
  buildMessages: string[];
  bundleBuildCount: number;
  collections: d.Collection[];
  components: d.ComponentCompilerMeta[];
  indexDoc: Document;
  packageJson: d.PackageJsonData;
  createTimeSpan(msg: string, debug?: boolean): d.LoggerTimeSpan;
  data: any;
  debug: (msg: string) => void;
  diagnostics: d.Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  entryModules: d.EntryModule[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  skipAssetsCopy: boolean;
  finish(): Promise<BuildResults>;
  global: d.Module;
  graphData: GraphData;
  hasConfigChanges: boolean;
  hasCopyChanges: boolean;
  hasError: boolean;
  hasFinished: boolean;
  hasIndexHtmlChanges: boolean;
  hasPrintedResults: boolean;
  hasServiceWorkerChanges: boolean;
  hasScriptChanges: boolean;
  hasSlot: boolean;
  hasStyleChanges: boolean;
  hasSvg: boolean;
  hasWarning: boolean;
  hydrateAppFilePath: string;
  indexBuildCount: number;
  isRebuild: boolean;
  moduleFiles: d.Module[];
  requiresFullBuild: boolean;
  rollupResults?: RollupResults;
  scriptsAdded: string[];
  scriptsDeleted: string[];
  shouldAbort: boolean;
  startTime: number;
  styleBuildCount: number;
  stylesPromise: Promise<void>;
  stylesUpdated: BuildStyleUpdate[];
  timeSpan: d.LoggerTimeSpan;
  timestamp: string;
  transpileBuildCount: number;
  pendingCopyTasks: Promise<d.CopyResults>[];
  validateTypesHandler?: (results: d.ValidateTypesResults) => Promise<void>;
  validateTypesPromise?: Promise<d.ValidateTypesResults>;
  validateTypesBuild?(): Promise<void>;
}


export interface BuildStyleUpdate {
  styleTag: string;
  styleText: string;
  styleMode: string;
  isScoped: boolean;
}


export type GraphData = Map<string, string[]>;


export interface BuildLog {
  messages: string[];
}


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
  excludeHmr?: string[];
  externalStylesUpdated?: string[];
  imagesUpdated?: string[];
  indexHtmlUpdated?: boolean;
  inlineStylesUpdated?: HmrStyleUpdate[];
  scriptsAdded?: string[];
  scriptsDeleted?: string[];
  serviceWorkerUpdated?: boolean;
  versionId?: string;
}


export interface HmrStyleUpdate {
  styleTag: string;
  styleText: string;
  styleMode: string;
  isScoped: boolean;
}


export interface BuildNoChangeResults {
  buildId: number;
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
  rollupResults: RollupResults;
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
  encapsulations: d.Encapsulation[];
}


export interface BuildBundle {
  fileName: string;
  outputs: string[];
  size?: number;
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


export type CompilerEventName = 'fileUpdate' | 'fileAdd' | 'fileDelete' | 'dirAdd' | 'dirDelete' | 'fsChange' | 'buildFinish' | 'buildNoChange' | 'buildLog';


export interface BundleOutputChunk {
  code: string;
  fileName: string;
  isDynamicEntry: boolean;
  isEntry: boolean;
  map: any;
  dynamicImports: string[];
  imports: string[];
  exports: string[];
  modules: {
    [modulePath: string]: {
      renderedExports: string[];
      removedExports: string[];
      renderedLength: number;
      originalLength: number;
    }
  };
  name: string;
}

export type SourceTarget = 'es5' | 'es2017';

export interface BundleAppOptions {
  inputs: BundleEntryInputs;
  loader: {[id: string]: string};
  cache?: any;
  emitCoreChunk?: boolean;
  externalRuntime?: string;
  skipDeps?: boolean;
  isServer?: boolean;
}

export interface BundleEntryInputs {
  [entryKey: string]: string;
}

export interface RollupResult {
  entryKey: string;
  fileName: string;
  code: string;
  isEntry: boolean;
  isComponent: boolean;
  isCore: boolean;
  isIndex: boolean;
  isBrowserLoader: boolean;
  imports: string[];
  moduleFormat: ModuleFormat;
}

export interface BundleModule {
  entryKey: string;
  modeNames: string[];
  rollupResult: RollupResult;
  cmps: d.ComponentCompilerMeta[];
  outputs: BundleModuleOutput[];
}

export interface BundleModuleOutput {
  bundleId: string;
  fileName: string;
  code: string;
  modeName: string;
}

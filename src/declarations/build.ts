import * as d from './index';


export interface BuildCtx {
  graphData?: GraphData;
  componentRefs?: d.PotentialComponentRef[];
  moduleGraphs?: d.ModuleGraph[];
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
    generateWWW: boolean;
    generateDistribution: boolean;
    minifyJs: boolean;
    minifyCss: boolean;
    hashFileNames: boolean;
    hashedFileNameLength: number;
    buildEs5: boolean;
  };
  components: BuildComponent[];
  entries: BuildEntry[];
  collections: {
    name: string;
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
  size: number;
  outputs: string[];
  mode?: string;
  scopedStyles?: boolean;
  target?: string;
}


export interface BuildComponent {
  tag: string;
  dependencyOf?: string[];
  dependencies?: string[];
}


export interface BuildConditionals {
  coreId?: 'core' | 'core.pf';
  polyfills?: boolean;
  verboseError: boolean;
  es5?: boolean;
  cssVarShim?: boolean;
  clientSide?: boolean;

  // ssr
  ssrServerSide: boolean;

  // encapsulation
  styles: boolean;

  // dom
  shadowDom: boolean;

  // vdom
  hostData: boolean;
  hostTheme: boolean;

  // decorators
  element: boolean;
  event: boolean;
  listener: boolean;
  method: boolean;
  propConnect: boolean;
  propContext: boolean;
  watchCallback: boolean;

  // lifecycle events
  cmpDidLoad: boolean;
  cmpWillLoad: boolean;
  cmpDidUpdate: boolean;
  cmpWillUpdate: boolean;
  cmpDidUnload: boolean;

  // attr
  observeAttr: boolean;

  // svg
  svg: boolean;
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
}


export type SourceTarget = 'es5' | 'es2015';

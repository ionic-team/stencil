import {
  BuildEmitEvents,
  BuildEvents,
  BuildLog,
  BuildOnEvents,
  BuildOutput,
  CompilerBuildResults,
  CompilerBuildStart,
  CompilerFsStats,
  CompilerSystem,
  Config,
  CopyResults,
  DevServerConfig,
  DevServerEditor,
  Diagnostic,
  FileSystem,
  FsWatcher,
  FsWriteOptions,
  HotModuleReplacement,
  Logger,
  LoggerTimeSpan,
  OptimizeCssInput,
  OptimizeCssOutput,
  OutputTargetWww,
  PageReloadStrategy,
  PrerenderRequest,
  PrerenderResults,
  StencilSystem,
} from './stencil-public-compiler';

import {
  ComponentInterface,
  ListenOptions,
  ListenTargetOptions,
  VNode,
  VNodeData,
} from './stencil-public-runtime';


export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  errorCharStart: number;
  errorLength?: number;
}

export interface AssetsMeta {
  absolutePath: string;
  cmpRelativePath: string;
  originalComponentPath: string;
}

export interface CompileOptions {
  /**
   * A component can be defined as a custom element by using `customelement`, or the
   * component class can be exported by using `module`. Default is `customelement`.
   */
  componentExport?: 'customelement' | 'module' | string | undefined;
  /**
   * Sets how and if component metadata should be assigned on the compiled
   * component output. The `compilerstatic` value will set the metadata to
   * a static `COMPILER_META` getter on the component class. This option
   * is useful for unit testing preprocessors. Default is `null`.
   */
  componentMetadata?: 'runtimestatic' | 'compilerstatic' | string | undefined;
  /**
   * The actual internal import path for any `@stencil/core` imports.
   * Default is `@stencil/core/internal/client`.
   */
  coreImportPath?: string;
  /**
   * The current working directory. Default is `/`.
   */
  currentDirectory?: string;
  /**
   * The filename of the code being compiled. Default is `module.tsx`.
   */
  file?: string;
  /**
   * Module format to use for the compiled code output, which can be either `esm` or `cjs`.
   * Default is `esm`.
   */
  module?: 'cjs' | 'esm' | string;
  /**
   * Sets how and if any properties, methods and events are proxied on the
   * component class. The `defineproperty` value sets the getters and setters
   * using Object.defineProperty. Default is `defineproperty`.
   */
  proxy?: 'defineproperty' | string | undefined;
  /**
   * How component styles should be associated to the component. The `static`
   * setting will assign the styles as a static getter on the component class.
   */
  style?: 'static' | string | undefined;
  /**
   * The JavaScript source target TypeScript should to transpile to. Values can be
   * `latest`, `esnext`, `es2017`, `es2015`, or `es5`. Defaults to `latest`.
   */
  target?: CompileTarget;
  /**
   * The path used to load TypeScript, which is dependent on which environment
   * the compiler is being used on. Default for NodeJS is `typescript`. Default
   * url to downloaded TypeScript in a brower's web worker or main thread is
   * from `https://cdn.jsdelivr.net/npm/`.
   */
  typescriptPath?: string;
  /**
   * Create a source map. Using `inline` will inline the source map into the
   * code, otherwise the source map will be in the returned `map` property.
   * Default is `true`.
   */
  sourceMap?: boolean | 'inline';
  /**
   * Base directory to resolve non-relative module names. Same as the `baseUrl`
   * TypeScript compiler option: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
   */
  baseUrl?: string;
  /**
   * List of path mapping entries for module names to locations relative to the `baseUrl`.
   * Same as the `baseUrl` TypeScript compiler option:
   * https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
   */
  paths?: {[key: string]: string[]};

  data?: StencilComponentData;
}

export interface CompileResults {
  code: string;
  componentMeta: any[];
  diagnostics: Diagnostic[];
  imports: { path: string; }[];
  inputFileExtension: string;
  inputFilePath: string;
  inputOptions: CompileOptions;
  map: any;
  outputFilePath: string;
}

export interface CompileScriptMinifyOptions {
  target?: CompileTarget;
  pretty?: boolean;
}


export type CompileTarget = 'latest' | 'esnext' | 'es2020' | 'es2019' | 'es2018' | 'es2017' | 'es2015' | 'es5' | string | undefined;

export interface ResolvedStencilData {
  resolvedId: string;
  resolvedFilePath: string;
  resolvedFileName: string;
  resolvedFileExt: string;
  params: string;
  data: StencilComponentData;
  importee: string;
  importer: string;
  importerExt: string;
}

export interface StencilComponentData {
  tag: string;
  encapsulation?: string;
  mode?: string;
}


export interface BuildFeatures {
  // encapsulation
  style: boolean;
  mode: boolean;

  // dom
  shadowDom: boolean;
  shadowDelegatesFocus: boolean;
  scoped: boolean;

  // render
  /**
   * Every component has a render function
   */
  allRenderFn: boolean;
  /**
   * At least one component has a render function
   */
  hasRenderFn: boolean;

  // vdom
  vdomRender: boolean;
  noVdomRender: boolean;
  vdomAttribute: boolean;
  vdomClass: boolean;
  vdomFunctional: boolean;
  vdomKey: boolean;
  vdomListener: boolean;
  vdomPropOrAttr: boolean;
  vdomRef: boolean;
  vdomStyle: boolean;
  vdomText: boolean;
  vdomXlink: boolean;
  slotRelocation: boolean;

  // elements
  slot: boolean;
  svg: boolean;

  // decorators
  element: boolean;
  event: boolean;
  hostListener: boolean;
  hostListenerTargetWindow: boolean;
  hostListenerTargetDocument: boolean;
  hostListenerTargetBody: boolean;
  hostListenerTargetParent: boolean;
  hostListenerTarget: boolean;
  method: boolean;
  prop: boolean;
  propMutable: boolean;
  state: boolean;
  watchCallback: boolean;
  member: boolean;
  updatable: boolean;
  propBoolean: boolean;
  propNumber: boolean;
  propString: boolean;

  // lifecycle events
  lifecycle: boolean;
  cmpDidLoad: boolean;
  cmpShouldUpdate: boolean;
  cmpWillLoad: boolean;
  cmpDidUpdate: boolean;
  cmpWillUpdate: boolean;
  cmpWillRender: boolean;
  cmpDidRender: boolean;
  cmpDidUnload: boolean;
  connectedCallback: boolean;
  disconnectedCallback: boolean;
  asyncLoading: boolean;

  // attr
  observeAttribute: boolean;
  reflect: boolean;

  taskQueue: boolean;
}

export interface BuildConditionals extends Partial<BuildFeatures> {
  hotModuleReplacement?: boolean;
  isDebug?: boolean;
  isTesting?: boolean;
  isDev?: boolean;
  devTools?: boolean;
  hydrateServerSide?: boolean;
  hydrateClientSide?: boolean;
  lifecycleDOMEvents?: boolean;
  cssAnnotations?: boolean;
  lazyLoad?: boolean;
  profile?: boolean;
  cssVarShim?: boolean;
  constructableCSS?: boolean;
  appendChildSlotFix?: boolean;
  cloneNodeFix?: boolean;
  dynamicImportShim?: boolean;
  hydratedAttribute?: boolean;
  hydratedClass?: boolean;
  initializeNextTick?: boolean;
  safari10?: boolean;
  scriptDataOpts?: boolean;
  shadowDomShim?: boolean;
}

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
  buildId: number;
  buildResults: BuildResults;
  buildResults_next: CompilerBuildResults;
  buildMessages: string[];
  bundleBuildCount: number;
  collections: Collection[];
  compilerCtx: CompilerCtx;
  components: ComponentCompilerMeta[];
  componentGraph: Map<string, string[]>;
  config: Config;
  createTimeSpan(msg: string, debug?: boolean): LoggerTimeSpan;
  data: any;
  debug: (msg: string) => void;
  diagnostics: Diagnostic[];
  dirsAdded: string[];
  dirsDeleted: string[];
  entryModules: EntryModule[];
  filesAdded: string[];
  filesChanged: string[];
  filesDeleted: string[];
  filesUpdated: string[];
  filesWritten: string[];
  globalStyle: string | undefined;
  hasConfigChanges: boolean;
  hasError: boolean;
  hasFinished: boolean;
  hasHtmlChanges: boolean;
  hasPrintedResults: boolean;
  hasServiceWorkerChanges: boolean;
  hasScriptChanges: boolean;
  hasStyleChanges: boolean;
  hasWarning: boolean;
  hydrateAppFilePath: string;
  indexBuildCount: number;
  indexDoc: Document;
  isRebuild: boolean;
  moduleFiles: Module[];
  packageJson: PackageJsonData;
  pendingCopyTasks: Promise<CopyResults>[];
  progress(task: BuildTask): void;
  requiresFullBuild: boolean;
  rollupResults?: RollupResults;
  scriptsAdded: string[];
  scriptsDeleted: string[];
  startTime: number;
  styleBuildCount: number;
  stylesPromise: Promise<void>;
  stylesUpdated: BuildStyleUpdate[];
  timeSpan: LoggerTimeSpan;
  timestamp: string;
  transpileBuildCount: number;
  validateTypesBuild?(): Promise<void>;
  validateTypesHandler?: (results: any) => Promise<void>;
  validateTypesPromise?: Promise<any>;
}

export interface BuildStyleUpdate {
  styleTag: string;
  styleText: string;
  styleMode: string;
}

export type BuildTask = any;

export interface BuildResults {
  buildId: number;
  buildConditionals: {
    shadow: boolean;
    slot: boolean;
    svg: boolean;
    vdom: boolean;
  };
  bundleBuildCount: number;
  components: BuildComponent[];
  componentGraph: Map<string, string[]>;
  diagnostics: Diagnostic[];
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
  hmr?: HotModuleReplacement;
  hydrateAppFilePath?: string;
  isRebuild: boolean;
  styleBuildCount: number;
  transpileBuildCount: number;
}

export type BuildStatus = 'pending' | 'error' | 'disabled' | 'default';

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
  encapsulations: Encapsulation[];
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

export type SourceTarget = 'es5' | 'es2017' | 'latest';

export interface BundleAppOptions {
  inputs: BundleEntryInputs;
  loader: { [id: string]: string };
  cache?: any;
  externalRuntime?: string;
  skipDeps?: boolean;
  isServer?: boolean;
}

export interface BundleEntryInputs {
  [entryKey: string]: string;
}

export type RollupResult = RollupChunkResult | RollupAssetResult;

export interface RollupAssetResult {
  type: 'asset';
  fileName: string;
  content: string;
}

export interface RollupChunkResult {
  type: 'chunk';
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
  rollupResult: RollupChunkResult;
  cmps: ComponentCompilerMeta[];
  outputs: BundleModuleOutput[];
}

export interface BundleModuleOutput {
  bundleId: string;
  fileName: string;
  code: string;
  modeName: string;
}

export interface Cache {
  get(key: string): Promise<string>;
  put(key: string, value: string): Promise<boolean>;
  has(key: string): Promise<boolean>;
  createKey(domain: string, ...args: any[]): Promise<string>;
  commit(): Promise<void>;
  clear(): void;
  clearDiskCache(): Promise<void>;
  getMemoryStats(): string;
  initCacheDir(): Promise<void>;
}

export interface CollectionCompilerMeta {
  collectionName?: string;
  moduleId?: string;
  moduleDir?: string;
  moduleFiles?: Module[];
  global?: Module;
  compiler?: CollectionCompilerVersion;
  isInitialized?: boolean;
  hasExports?: boolean;
  dependencies?: string[];
  bundles?: {
    components: string[];
  }[];
}

export interface CollectionCompilerVersion {
  name: string;
  version: string;
  typescriptVersion?: string;
}

export interface CollectionManifest {
  entries?: CollectionComponentEntryPath[];
  collections?: CollectionDependencyManifest[];
  global?: string;
  compiler?: CollectionCompilerVersion;
  bundles?: CollectionBundleManifest[];

  /**
   * DEPRECATED
   */
  components?: ComponentDataDeprecated[];
}

export type CollectionComponentEntryPath = string;

export interface CollectionBundleManifest {
  components: string[];
}

export interface CollectionDependencyManifest {
  name: string;
  tags: string[];
}

/**** DEPRECATED *****/
export interface ComponentDataDeprecated {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
  dependencies?: string[];
  styles?: StylesDataDeprecated;
  props?: PropManifestDeprecated[];
  states?: StateManifestDeprecated[];
  listeners?: ListenerManifestDeprecated[];
  methods?: MethodManifestDeprecated[];
  events?: EventManifestDeprecated[];
  connect?: ConnectManifestDeprecated[];
  context?: ContextManifestDeprecated[];
  hostElement?: HostElementManifestDeprecated;
  host?: any;
  assetPaths?: string[];
  slot?: 'hasSlots' | 'hasNamedSlots';
  shadow?: boolean;
  scoped?: boolean;
  priority?: 'low';
}

export interface StylesDataDeprecated {
  [modeName: string]: StyleDataDeprecated;
}

export interface StyleDataDeprecated {
  stylePaths?: string[];
  style?: string;
}

export interface PropManifestDeprecated {
  name?: string;
  type?: 'Boolean' | 'Number' | 'String' | 'Any';
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
  watch?: string[];
}

export interface StateManifestDeprecated {
  name: string;
}

export interface ListenerManifestDeprecated {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface MethodManifestDeprecated {
  name: string;
}

export interface EventManifestDeprecated {
  event: string;
  method?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface ConnectManifestDeprecated {
  name: string;
  tag?: string;
}

export interface ContextManifestDeprecated {
  name: string;
  id?: string;
}

export interface HostElementManifestDeprecated {
  name: string;
}

/** OLD WAY */
export interface Collection {
  collectionName?: string;
  moduleDir?: string;
  moduleFiles?: any[];
  global?: any;
  compiler?: CollectionCompiler;
  isInitialized?: boolean;
  hasExports?: boolean;
  dependencies?: string[];
  bundles?: {
    components: string[];
  }[];
}

export interface CollectionCompiler {
  name: string;
  version: string;
  typescriptVersion?: string;
}

export interface AppRegistry {
  namespace?: string;
  fsNamespace?: string;
  loader?: string;
  core?: string;
  corePolyfilled?: string;
  global?: string;
  components?: AppRegistryComponents;
}

export interface AppRegistryComponents {
  [tagName: string]: {
    bundleIds: ModeBundleIds,
    encapsulation?: 'shadow' | 'scoped';
  };
}

/** OLD WAY */
export interface ModuleFile {
  sourceFilePath: string;
  jsFilePath?: string;
  dtsFilePath?: string;
  cmpMeta?: any;
  isCollectionDependency?: boolean;
  excludeFromCollection?: boolean;
  originalCollectionComponentPath?: string;
  externalImports?: string[];
  localImports?: string[];
  potentialCmpRefs?: string[];
  hasSlot?: boolean;
  hasSvg?: boolean;
}

export interface ModuleBundles {
  [bundleId: string]: string;
}

// this maps the json data to our internal data structure
// so that the internal data structure "could" change,
// but the external user data will always use the same api
// consider these property values to be locked in as is
// there should be a VERY good reason to have to rename them
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!

export interface CollectionData {
  components?: ComponentData[];
  collections?: CollectionDependencyData[];
  global?: string;
  modules?: string[];
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
  };
  bundles?: CollectionBundle[];
}

export interface CollectionBundle {
  components: string[];
}

export interface CollectionDependencyData {
  name: string;
  tags: string[];
}

export interface ComponentData {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
  dependencies?: string[];
  styles?: StylesData;
  props?: PropData[];
  states?: StateData[];
  listeners?: ListenerData[];
  methods?: MethodData[];
  events?: EventData[];
  connect?: ConnectData[];
  context?: ContextData[];
  hostElement?: HostElementData;
  host?: any;
  assetPaths?: string[];
  slot?: 'hasSlots' | 'hasNamedSlots';
  shadow?: boolean;
  scoped?: boolean;
  priority?: 'low';
}

export interface StylesData {
  [modeName: string]: StyleData;
}

export interface StyleData {
  stylePaths?: string[];
  style?: string;
}

export interface PropData {
  name?: string;
  type?: 'Boolean' | 'Number' | 'String' | 'Any';
  mutable?: boolean;
  attr?: string;
  reflectToAttr?: boolean;
  watch?: string[];
}

export interface StateData {
  name: string;
}

export interface ListenerData {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface MethodData {
  name: string;
}

export interface EventData {
  event: string;
  method?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface ConnectData {
  name: string;
  tag?: string;
}

export interface ContextData {
  name: string;
  id?: string;
}

export interface HostElementData {
  name: string;
}

export interface CompilerNext {
  build(): Promise<CompilerBuildResults>;
  createWatcher(): Promise<CompilerWatcher>;
  destroy(): Promise<void>;
  sys: CompilerSystem;
}

export interface CompilerWatcher extends BuildOnEvents {
  start(): Promise<WatcherCloseResults>;
  close(): Promise<WatcherCloseResults>;
  request(data: CompilerRequest): Promise<CompilerRequestResponse>;
}

export interface CompilerRequest {
  path?: string;
}

export interface CompilerRequestResponse {
  nodeModuleId: string;
  nodeModuleVersion: string;
  nodeResolvedPath: string;
  cachePath: string;
  cacheHit: boolean;
  content: string;
  status: number;
}

export interface BuildOutputFile {
  name: string;
  content: string;
}

export type OnCallback = (buildStart: CompilerBuildStart) => void;
export type RemoveCallback = () => boolean;

export interface WatcherCloseResults {
  exitCode: number;
}

export interface Compiler {
  build(): Promise<BuildResults>;
  config: Config;
  docs(): Promise<void>;
  fs: InMemoryFileSystem;
  isValid: boolean;
}

export interface CompilerCtx {
  version: number;
  activeBuildId: number;
  activeDirsAdded: string[];
  activeDirsDeleted: string[];
  activeFilesAdded: string[];
  activeFilesDeleted: string[];
  activeFilesUpdated: string[];
  cache: Cache;
  cachedStyleMeta: Map<string, StyleCompiler>;
  cachedGlobalStyle: string;
  collections: CollectionCompilerMeta[];
  compilerOptions: any;
  events: BuildEvents;
  fs: InMemoryFileSystem;
  fsWatcher: FsWatcher;
  hasSuccessfulBuild: boolean;
  isActivelyBuilding: boolean;
  lastComponentStyleInput: Map<string, string>;
  lastBuildResults: BuildResults;
  lastBuildStyles: Map<string, string>;
  moduleMap: ModuleMap;
  nodeMap: NodeMap;
  resolvedCollections: Set<string>;
  rollupCacheHydrate: any;
  rollupCacheLazy: any;
  rollupCacheNative: any;
  rootTsFiles: string[];
  styleModeNames: Set<string>;
  tsService: TsService;
  changedModules: Set<string>;
  changedFiles: Set<string>;
  worker?: CompilerWorkerContext;

  rollupCache: Map<string, any>;

  reset(): void;
}

export type NodeMap = WeakMap<any, ComponentCompilerMeta>;

export type TsService = (compilerCtx: CompilerCtx, buildCtx: BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<boolean>;

/** Must be serializable to JSON!! */
export interface ComponentCompilerFeatures {
  hasAttribute: boolean;
  hasAttributeChangedCallbackFn: boolean;
  hasComponentWillLoadFn: boolean;
  hasComponentDidLoadFn: boolean;
  hasComponentShouldUpdateFn: boolean;
  hasComponentWillUpdateFn: boolean;
  hasComponentDidUpdateFn: boolean;
  hasComponentWillRenderFn: boolean;
  hasComponentDidRenderFn: boolean;
  hasComponentDidUnloadFn: boolean;
  hasConnectedCallbackFn: boolean;
  hasDisconnectedCallbackFn: boolean;
  hasElement: boolean;
  hasEvent: boolean;
  hasLifecycle: boolean;
  hasListener: boolean;
  hasListenerTarget: boolean;
  hasListenerTargetWindow: boolean;
  hasListenerTargetDocument: boolean;
  hasListenerTargetBody: boolean;
  hasListenerTargetParent: boolean;
  hasMember: boolean;
  hasMethod: boolean;
  hasMode: boolean;
  hasProp: boolean;
  hasPropBoolean: boolean;
  hasPropNumber: boolean;
  hasPropString: boolean;
  hasPropMutable: boolean;
  hasReflect: boolean;
  hasRenderFn: boolean;
  hasState: boolean;
  hasStyle: boolean;
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
  hasWatchCallback: boolean;
  htmlAttrNames: string[];
  htmlTagNames: string[];
  isUpdateable: boolean;
  isPlain: boolean;
  potentialCmpRefs: string[];
}

/** Must be serializable to JSON!! */
export interface ComponentCompilerMeta extends ComponentCompilerFeatures {
  assetsDirs: CompilerAssetDir[];
  componentClassName: string;
  elementRef: string;
  encapsulation: Encapsulation;
  shadowDelegatesFocus: boolean;
  excludeFromCollection: boolean;
  isCollectionDependency: boolean;
  isLegacy: boolean;
  docs: CompilerJsDoc;
  jsFilePath: string;
  listeners: ComponentCompilerListener[];
  events: ComponentCompilerEvent[];
  methods: ComponentCompilerMethod[];
  virtualProperties: ComponentCompilerVirtualProperty[];
  properties: ComponentCompilerProperty[];
  watchers: ComponentCompilerWatch[];
  sourceFilePath: string;
  states: ComponentCompilerState[];
  styleDocs: CompilerStyleDoc[];
  styles: StyleCompiler[];
  tagName: string;
  internal: boolean;
  legacyConnect: ComponentCompilerLegacyConnect[];
  legacyContext: ComponentCompilerLegacyContext[];

  dependencies?: string[];
  dependents?: string[];
  directDependencies?: string[];
  directDependents?: string[];
}

export interface ComponentCompilerLegacyConnect {
  name: string;
  connect: string;
}

export interface ComponentCompilerLegacyContext {
  name: string;
  context: string;
}

export type Encapsulation = 'shadow' | 'scoped' | 'none';

export interface ComponentCompilerStaticProperty {
  mutable: boolean;
  optional: boolean;
  required: boolean;
  type: ComponentCompilerPropertyType;
  complexType: ComponentCompilerPropertyComplexType;
  attribute?: string;
  reflect?: boolean;
  docs: CompilerJsDoc;
  defaultValue?: string;
}

export interface ComponentCompilerProperty extends ComponentCompilerStaticProperty {
  name: string;
  internal: boolean;
}

export interface ComponentCompilerVirtualProperty {
  name: string;
  type: string;
  docs: string;
}

export type ComponentCompilerPropertyType = 'any' | 'string' | 'boolean' | 'number' | 'unknown';

export interface ComponentCompilerPropertyComplexType {
  original: string;
  resolved: string;
  references: ComponentCompilerTypeReferences;
}

export interface ComponentCompilerTypeReferences {
  [key: string]: ComponentCompilerTypeReference;
}

export interface ComponentCompilerTypeReference {
  location: 'local' | 'global' | 'import';
  path?: string;
}

export interface ComponentCompilerStaticEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
  docs: CompilerJsDoc;
  complexType: ComponentCompilerEventComplexType;
}

export interface ComponentCompilerEvent extends ComponentCompilerStaticEvent {
  internal: boolean;
}

export interface ComponentCompilerEventComplexType {
  original: string;
  resolved: string;
  references: ComponentCompilerTypeReferences;
}

export interface ComponentCompilerListener {
  name: string;
  method: string;
  capture: boolean;
  passive: boolean;
  target: ListenTargetOptions | undefined;
}

export interface ComponentCompilerStaticMethod {
  docs: CompilerJsDoc;
  complexType: ComponentCompilerMethodComplexType;
}

export interface ComponentCompilerMethodComplexType {
  signature: string;
  parameters: CompilerJsDoc[];
  references: ComponentCompilerTypeReferences;
  return: string;
}

export interface ComponentCompilerWatch {
  propName: string;
  methodName: string;
}

export interface ComponentCompilerMethod extends ComponentCompilerStaticMethod {
  name: string;
  internal: boolean;
}

export interface ComponentCompilerState {
  name: string;
}

export interface CompilerJsDoc {
  text: string;
  tags: CompilerJsDocTagInfo[];
}

export interface CompilerJsDocTagInfo {
  name: string;
  text?: string;
}

export interface CompilerStyleDoc {
  name: string;
  docs: string;
  annotation: 'prop';
}

export interface CompilerAssetDir {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
}

export interface ComponentCompilerData {
  exportLine: string;
  filePath: string;
  cmp: ComponentCompilerMeta;
  uniqueComponentClassName?: string;
  importLine?: string;
}

export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  watchers?: ComponentConstructorWatchers;
  events?: ComponentConstructorEvent[];
  listeners?: ComponentConstructorListener[];
  style?: string;
  styleId?: string;
  encapsulation?: ComponentConstructorEncapsulation;
  observedAttributes?: string[];
  cmpMeta?: ComponentRuntimeMeta;
  isProxied?: boolean;
  isStyleRegistered?: boolean;
}

export interface ComponentConstructorWatchers {
  [propName: string]: string[];
}

export interface ComponentTestingConstructor extends ComponentConstructor {
  COMPILER_META: ComponentCompilerMeta;
  prototype?: {
    componentWillLoad?: Function;
    componentWillUpdate?: Function;
    componentWillRender?: Function;
    __componentWillLoad?: Function;
    __componentWillUpdate?: Function;
    __componentWillRender?: Function;
  };
}

export interface ComponentNativeConstructor extends ComponentConstructor {
  cmpMeta: ComponentRuntimeMeta;
}

export type ComponentConstructorEncapsulation = 'shadow' | 'scoped' | 'none';

export interface ComponentConstructorProperties {
  [propName: string]: ComponentConstructorProperty;
}

export interface ComponentConstructorProperty {
  attribute?: string;
  elementRef?: boolean;
  method?: boolean;
  mutable?: boolean;
  reflect?: boolean;
  state?: boolean;
  type?: ComponentConstructorPropertyType;
  watchCallbacks?: string[];
}

export type ComponentConstructorPropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'string' | 'boolean' | 'number';

export interface ComponentConstructorEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
}

export interface ComponentConstructorListener {
  name: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
}

export interface HostConfig {
  hosting?: {
    rules?: HostRule[];
  };
}

export interface HostRule {
  include: string;
  headers: HostRuleHeader[];
}

export interface HostRuleHeader {
  name?: string;
  value?: string;
}

export interface CssVarShim {
  i(): Promise<any>;
  addLink(linkEl: HTMLLinkElement): Promise<any>;
  addGlobalStyle(styleEl: HTMLStyleElement): void;

  createHostStyle(
    hostEl: HTMLElement,
    templateName: string,
    cssText: string,
    isScoped: boolean
  ): HTMLStyleElement;

  removeHost(hostEl: HTMLElement): void;
  updateHost(hostEl: HTMLElement): void;
  updateGlobal(): void;
}

export interface DevServer extends BuildEmitEvents {
  browserUrl: string;
  close(): Promise<void>;
}

export interface DevServerStartResponse {
  browserUrl: string;
  initialLoadUrl: string;
  error: string;
}

export interface DevClientWindow extends Window {
  ['s-dev-server']: boolean;
  ['s-initial-load']: boolean;
  WebSocket: new (socketUrl: string, protos: string[]) => WebSocket;
}

export interface DevClientConfig {
  basePath: string;
  editors: DevServerEditor[];
  reloadStrategy: PageReloadStrategy;
}

export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  acceptHeader: string;
  url: string;
  pathname?: string;
  filePath?: string;
  stats?: CompilerFsStats;
  headers?: { [name: string]: string };
  host?: string;
}

export interface DevServerMessage {
  resolveId?: number;
  startServer?: DevServerConfig;
  serverStarted?: DevServerStartResponse;
  buildLog?: BuildLog;
  buildResults?: BuildResults;
  requestBuildResults?: boolean;
  error?: { message?: string; type?: string; stack?: any; };
  isActivelyBuilding?: boolean;
  compilerRequestPath?: string;
  compilerRequestResults?: CompilerRequestResponse;
  requestLog?: {
    method: string;
    url: string;
    status: number;
  };
}

export type DevServerDestroy = () => void;

export interface DevResponseHeaders {
  'Cache-Control'?: string;
  'Expires'?: string;
  'Content-Type'?: string;
  'Content-Length'?: number;
  'Access-Control-Allow-Origin'?: string;
  'Content-Encoding'?: 'gzip';
  'Vary'?: 'Accept-Encoding';
  'X-Powered-By'?: string;
  'X-Directory-Index'?: string;
}

export interface OpenInEditorData {
  file?: string;
  line?: number;
  column?: number;
  open?: string;
  editor?: string;
  exists?: boolean;
  error?: string;
}

export interface EntryModule {
  entryKey: string;
  cmps: ComponentCompilerMeta[];
  modeNames: string[];
}

export interface EntryBundle {
  fileName: string;
  text: string;
  outputs: string[];
  modeName: string;
  isScopedStyles: boolean;
  sourceTarget: string;
}

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

export interface AddEventListener {
  (elm: Element | Document | Window, eventName: string, cb: EventListenerCallback, opts?: ListenOptions): Function;
}

export interface EventListenerCallback {
  (ev?: any): void;
}

export interface EventEmitterData<T = any> {
  detail?: T;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface FsReadOptions {
  useCache?: boolean;
  setHash?: boolean;
}

export interface FsReaddirOptions {
  inMemoryOnly?: boolean;
  recursive?: boolean;
  /**
   * Directory names to exclude. Just the basename,
   * not the entire path. Basically for "node_moduels".
   */
  excludeDirNames?: string[];
  /**
   * Extensions we know we can avoid. Each extension
   * should include the `.` so that we can test for both
   * `.d.ts.` and `.ts`. If `excludeExtensions` isn't provided it
   * doesn't try to exclude anything. This only checks against
   * the filename, not directory names when recursive.
   */
  excludeExtensions?: string[];
}

export interface FsReaddirItem {
  absPath: string;
  relPath: string;
  isDirectory: boolean;
  isFile: boolean;
}

export interface FsWriteResults {
  changedContent: boolean;
  queuedWrite: boolean;
  ignored: boolean;
}

export type FsItems = Map<string, FsItem>;

export interface FsItem {
  fileText: string;
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  mtimeMs: number;
  exists: boolean;
  queueCopyFileToDest: string;
  queueWriteToDisk: boolean;
  queueDeleteFromDisk?: boolean;
  useCache: boolean;
}

export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback?: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;
  host?: Element;
  forceUpdate?: () => void;

  // "s-" prefixed properties should not be property renamed
  // and should be common between all versions of stencil

  /**
   * Unique stencil id for this element
   */
  ['s-id']?: string;

  /**
   * Content Reference:
   * Reference to the HTML Comment that's placed inside of the
   * host element's original content. This comment is used to
   * always represent where host element's light dom is.
   */
  ['s-cr']?: RenderNode;

  /**
   * Lifecycle ready
   */
  ['s-lr']?: boolean;

  /**
   * On Render Callbacks:
   * Array of callbacks to fire off after it has rendered.
   */
  ['s-rc']?: (() => void)[];

  /**
   * Scope Id
   * The scope id of this component when using scoped css encapsulation
   * or using shadow dom but the browser doesn't support it
   */
  ['s-sc']?: string;

  /**
   * Hot Module Replacement, dev mode only
   */
  ['s-hmr']?: (versionId: string) => void;

  /**
   * Callback method for when HMR finishes
   */
  ['s-hmr-load']?: () => void;

  ['s-p']?: Promise<void>[];

  componentOnReady?: () => Promise<this>;
}

export interface CustomElementsDefineOptions {
  exclude?: string[];
  resourcesUrl?: string;
  syncQueue?: boolean;
  jmp?: (c: Function) => any;
  raf?: (c: FrameRequestCallback) => number;
  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
}

export interface InMemoryFileSystem {
  /* new compiler */
  sys?: CompilerSystem;

  /** legacy */
  disk?: FileSystem;

  accessData(filePath: string): Promise<{
    exists: boolean;
    isDirectory: boolean;
    isFile: boolean;
  }>;
  access(filePath: string): Promise<boolean>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  accessSync(filePath: string): boolean;
  copyFile(srcFile: string, dest: string): Promise<void>;
  emptyDir(dirPath: string): Promise<void>;
  readdir(dirPath: string, opts?: FsReaddirOptions): Promise<FsReaddirItem[]>;
  readFile(filePath: string, opts?: FsReadOptions): Promise<string>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  readFileSync(filePath: string, opts?: FsReadOptions): string;
  remove(itemPath: string): Promise<void>;
  stat(itemPath: string): Promise<{
    isFile: boolean;
    isDirectory: boolean;
  }>;
  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param itemPath
   */
  statSync(itemPath: string): {
    exists: boolean;
    isFile: boolean;
    isDirectory: boolean;
  };
  writeFile(filePath: string, content: string, opts?: FsWriteOptions): Promise<FsWriteResults>;
  writeFiles(files: {
    [filePath: string]: string;
  } | Map<string, String>, opts?: FsWriteOptions): Promise<FsWriteResults[]>;
  commit(): Promise<{
    filesWritten: string[];
    filesDeleted: string[];
    filesCopied: string[][];
    dirsDeleted: string[];
    dirsAdded: string[];
  }>;
  cancelDeleteFilesFromDisk(filePaths: string[]): void;
  cancelDeleteDirectoriesFromDisk(filePaths: string[]): void;
  clearDirCache(dirPath: string): void;
  clearFileCache(filePath: string): void;
  getItem(itemPath: string): FsItem;
  getBuildOutputs(): BuildOutput[];
  clearCache(): void;
  keys(): string[];
  getMemoryStats(): string;
}

export interface HydrateDocumentOptions {
  canonicalUrl?: string;
  constrainTimeouts?: boolean;
  clientHydrateAnnotations?: boolean;
  cookie?: string;
  direction?: string;
  excludeComponents?: string[];
  language?: string;
  maxHydrateCount?: number;
  referrer?: string;
  removeScripts?: boolean;
  removeUnusedStyles?: boolean;
  resourcesUrl?: string;
  timeout?: number;
  title?: string;
  url?: string;
  userAgent?: string;
}

export interface SerializeDocumentOptions extends HydrateDocumentOptions {
  afterHydrate?(document: any): any | Promise<any>;
  approximateLineWidth?: number;
  beforeHydrate?(document: any): any | Promise<any>;
  prettyHtml?: boolean;
  removeAttributeQuotes?: boolean;
  removeBooleanAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
  removeHtmlComments?: boolean;
}

export interface HydrateFactoryOptions extends SerializeDocumentOptions {
  serializeToHtml: boolean;
  destroyWindow: boolean;
  destroyDocument: boolean;
}

export interface HydrateResults {
  diagnostics: Diagnostic[];
  url: string;
  host: string;
  hostname: string;
  href: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  html: string;
  components: HydrateComponent[];
  anchors: HydrateAnchorElement[];
  styles: HydrateStyleElement[];
  scripts: HydrateScriptElement[];
  imgs: HydrateImgElement[];
  title: string;
  hydratedCount: number;
  httpStatus: number;
}

export interface HydrateComponent {
  tag: string;
  mode: string;
  count: number;
  depth: number;
}

export interface HydrateElement {
  [attrName: string]: string | undefined;
}

export interface HydrateAnchorElement extends HydrateElement {
  href?: string;
  target?: string;
}

export interface HydrateStyleElement extends HydrateElement {
  href?: string;
}

export interface HydrateScriptElement extends HydrateElement {
  src?: string;
  type?: string;
}

export interface HydrateImgElement extends HydrateElement {
  src?: string;
}

export interface JsDoc {
  name: string;
  documentation: string;
  type: string;
  tags: JSDocTagInfo[];
  default?: string;
  parameters?: JsDoc[];
  returns?: {
    type: string;
    documentation: string;
  };
}

export interface JSDocTagInfo {
  name: string;
  text?: string;
}

export interface MinifyJsResult {
  code: string;
  sourceMap: any;
  error: {
    message: string;
    filename: string;
    line: number;
    col: number;
    pos: number;
  };
}

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
  staticSourceFile: any;
  staticSourceFileText: string;

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

export interface Plugin {
  name?: string;
  pluginType?: string;
  load?: (id: string, context: PluginCtx) => Promise<string> | string;
  resolveId?: (importee: string, importer: string, context: PluginCtx) => Promise<string> | string;
  transform?: (sourceText: string, id: string, context: PluginCtx) => Promise<PluginTransformResults> | PluginTransformResults | string;
}

export interface PluginTransformResults {
  code?: string;
  map?: string;
  id?: string;
  diagnostics?: Diagnostic[];
  dependencies?: string[];
}

export interface PluginCtx {
  config: Config;
  sys: StencilSystem;
  fs: InMemoryFileSystem;
  cache: Cache;
  diagnostics: Diagnostic[];
}

export interface ProgressLogger {
  update(text: string): Promise<void>;
  stop(): Promise<void>;
}

export interface PrerenderManager {
  prcs: NodeJS.Process;
  config: Config;
  prerenderUrlWorker: (prerenderRequest: PrerenderRequest) => Promise<PrerenderResults>;
  devServerHostUrl: string;
  diagnostics: Diagnostic[];
  hydrateAppFilePath: string;
  isDebug: boolean;
  logCount: number;
  outputTarget: OutputTargetWww;
  prerenderConfig: PrerenderConfig;
  prerenderConfigPath: string;
  progressLogger?: ProgressLogger;
  resolve: Function;
  templateId: string;
  componentGraphPath: string;
  urlsProcessing: Set<string>;
  urlsPending: Set<string>;
  urlsCompleted: Set<string>;
  maxConcurrency: number;
}

export interface PrerenderHydrateOptions extends SerializeDocumentOptions {
  addModulePreloads?: boolean;
  inlineExternalStyleSheets?: boolean;
  minifyStyleElements?: boolean;
  minifyScriptElements?: boolean;
}

export interface PrerenderConfig {
  afterHydrate?(document?: Document, url?: URL): any | Promise<any>;
  beforeHydrate?(document?: Document, url?: URL): any | Promise<any>;
  canonicalUrl?(url?: URL): string | null;
  entryUrls?: string[];
  filterAnchor?(attrs: { [attrName: string]: string }, base?: URL): boolean;
  filterUrl?(url?: URL, base?: URL): boolean;
  filePath?(url?: URL, filePath?: string): string;
  hydrateOptions?(url?: URL): PrerenderHydrateOptions;
  normalizeUrl?(href?: string, base?: URL): URL;
  robotsTxt?(opts: RobotsTxtOpts): string | RobotsTxtResults;
  sitemapXml?(opts: SitemapXmpOpts): string | SitemapXmpResults;
  trailingSlash?: boolean;
}

export interface RobotsTxtOpts {
  urls: string[];
  sitemapUrl: string;
  baseUrl: string;
  dir: string;
}

export interface RobotsTxtResults {
  content: string;
  filePath: string;
  url: string;
}

export interface SitemapXmpOpts {
  urls: string[];
  baseUrl: string;
  dir: string;
}

export interface SitemapXmpResults {
  content: string;
  filePath: string;
  url: string;
}

/**
 * Generic node that represents all of the
 * different types of nodes we'd see when rendering
 */
export interface RenderNode extends HostElement {

  /**
   * Shadow root's host
   */
  host?: Element;

  /**
   * Is Content Reference Node:
   * This node is a content reference node.
   */
  ['s-cn']?: boolean;

  /**
   * Is a slot reference node:
   * This is a node that represents where a slots
   * was originally located.
   */
  ['s-sr']?: boolean;

  /**
   * Slot name
   */
  ['s-sn']?: string;

  /**
   * Host element tag name:
   * The tag name of the host element that this
   * node was created in.
   */
  ['s-hn']?: string;

  /**
   * Original Location Reference:
   * A reference pointing to the comment
   * which represents the original location
   * before it was moved to its slot.
   */
  ['s-ol']?: RenderNode;

  /**
   * Node reference:
   * This is a reference for a original location node
   * back to the node that's been moved around.
   */
  ['s-nr']?: RenderNode;

  /**
   * Scope Id
   */
  ['s-si']?: string;

  /**
   * Host Id (hydrate only)
   */
  ['s-host-id']?: number;

  /**
   * Node Id (hydrate only)
   */
  ['s-node-id']?: number;

  /**
   * Used to know the components encapsulation.
   * empty "" for shadow, "c" from scoped
   */
  ['s-en']?: '' /*shadow*/ | 'c' /*scoped*/;
}

export type LazyBundlesRuntimeData = LazyBundleRuntimeData[];

export type LazyBundleRuntimeData = [
  /** bundleIds */
  any,
  ComponentRuntimeMetaCompact[]
];

export type ComponentRuntimeMetaCompact = [
  /** flags */
  number,

  /** tagname */
  string,

  /** members */
  { [memberName: string]: ComponentRuntimeMember }?,

  /** listeners */
  ComponentRuntimeHostListener[]?
];

export interface ComponentRuntimeMeta {
  $flags$: number;
  $tagName$: string;
  $members$?: ComponentRuntimeMembers;
  $listeners$?: ComponentRuntimeHostListener[];
  $attrsToReflect$?: [string, string][];
  $watchers$?: ComponentConstructorWatchers;
  $lazyBundleIds$?: ModeBundleIds;
}

export interface ComponentRuntimeMembers {
  [memberName: string]: ComponentRuntimeMember;
}

export type ComponentRuntimeMember = [
  /**
   * flags data
   */
  number,

  /**
   * attribute name to observe
   */
  string?
];

export type ComponentRuntimeHostListener = [
  /**
   * event flags
   */
  number,

  /**
   * event name,
   */
  string,

  /**
   * event method,
   */
  string
];

export type ModeBundleId = ModeBundleIds | string;

export interface ModeBundleIds {
  [modeName: string]: string;
}

export type RuntimeRef = HostElement | {};

export interface HostRef {
  $ancestorComponent$?: HostElement;
  $flags$: number;
  $cmpMeta$: ComponentRuntimeMeta;
  $hostElement$?: HostElement;
  $instanceValues$?: Map<string, any>;
  $lazyInstance$?: ComponentInterface;
  $onReadyPromise$?: Promise<any>;
  $onReadyResolve$?: (elm: any) => void;
  $onInstancePromise$?: Promise<any>;
  $onInstanceResolve$?: (elm: any) => void;
  $onRenderResolve$?: () => void;
  $vnode$?: VNode;
  $queuedListeners$?: [string, any][];
  $rmListeners$?: (() => void)[];
  $modeName$?: string;
  $renderCount$?: number;
}

export interface PlatformRuntime {
  $cssShim$?: CssVarShim;
  $flags$: number;
  $orgLocNodes$?: Map<string, RenderNode>;
  $resourcesUrl$: string;
  $supportsShadow$?: boolean;
  jmp: (c: Function) => any;
  raf: (c: FrameRequestCallback) => number;
  ael: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
  rel: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
}

export type RefMap = WeakMap<any, HostRef>;

export type StyleMap = Map<string, CSSStyleSheet | string>;

export type RootAppliedStyleMap = WeakMap<Element, Set<string>>;

export type AppliedStyleMap = Set<string>;

export type ActivelyProcessingCmpMap = Set<Element>;

export interface ScreenshotConnector {
  initBuild(opts: ScreenshotConnectorOptions): Promise<void>;
  completeBuild(masterBuild: ScreenshotBuild): Promise<ScreenshotBuildResults>;
  getMasterBuild(): Promise<ScreenshotBuild>;
  pullMasterBuild(): Promise<void>;
  publishBuild(buildResults: ScreenshotBuildResults): Promise<ScreenshotBuildResults>;
  getScreenshotCache(): Promise<ScreenshotCache>;
  updateScreenshotCache(screenshotCache: ScreenshotCache, buildResults: ScreenshotBuildResults): Promise<ScreenshotCache>;
  generateJsonpDataUris(build: ScreenshotBuild): Promise<void>;
  sortScreenshots(screenshots: Screenshot[]): Screenshot[];
  toJson(masterBuild: ScreenshotBuild, screenshotCache: ScreenshotCache): string;
}

export interface ScreenshotBuildResults {
  appNamespace: string;
  masterBuild: ScreenshotBuild;
  currentBuild: ScreenshotBuild;
  compare: ScreenshotCompareResults;
}

export interface ScreenshotCompareResults {
  id: string;
  a: {
    id: string;
    message: string;
    author: string;
    url: string;
    previewUrl: string;
  };
  b: {
    id: string;
    message: string;
    author: string;
    url: string;
    previewUrl: string;
  };
  timestamp: number;
  url: string;
  appNamespace: string;
  diffs: ScreenshotDiff[];
}

export interface ScreenshotConnectorOptions {
  buildId: string;
  buildMessage: string;
  buildAuthor?: string;
  buildUrl?: string;
  previewUrl?: string;
  appNamespace: string;
  buildTimestamp: number;
  logger: Logger;
  rootDir: string;
  cacheDir: string;
  packageDir: string;
  screenshotDirName?: string;
  imagesDirName?: string;
  buildsDirName?: string;
  currentBuildDir?: string;
  updateMaster?: boolean;
  allowableMismatchedPixels?: number;
  allowableMismatchedRatio?: number;
  pixelmatchThreshold?: number;
  waitBeforeScreenshot?: number;
  pixelmatchModulePath?: string;
}

export interface ScreenshotBuildData {
  buildId: string;
  rootDir: string;
  screenshotDir: string;
  imagesDir: string;
  buildsDir: string;
  currentBuildDir: string;
  updateMaster: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  pixelmatchThreshold: number;
  masterScreenshots: { [screenshotId: string]: string };
  cache: { [cacheKey: string]: number };
  timeoutBeforeScreenshot: number;
  pixelmatchModulePath: string;
}

export interface PixelMatchInput {
  imageAPath: string;
  imageBPath: string;
  width: number;
  height: number;
  pixelmatchThreshold: number;
}

export interface ScreenshotBuild {
  id: string;
  message: string;
  author?: string;
  url?: string;
  previewUrl?: string;
  appNamespace: string;
  timestamp: number;
  screenshots: Screenshot[];
}

export interface ScreenshotCache {
  timestamp?: number;
  lastBuildId?: string;
  size?: number;
  items?: {
    /**
     * Cache key
     */
    key: string;

    /**
     * Timestamp used to remove the oldest data
     */
    ts: number;

    /**
     * Mismatched pixels
     */
    mp: number;
  }[];
}

export interface Screenshot {
  id: string;
  desc?: string;
  image: string;
  device?: string;
  userAgent?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  testPath?: string;
  diff?: ScreenshotDiff;
}

export interface ScreenshotDiff {
  mismatchedPixels: number;
  id?: string;
  desc?: string;
  imageA?: string;
  imageB?: string;
  device?: string;
  userAgent?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isLandscape?: boolean;
  isMobile?: boolean;
  allowableMismatchedPixels: number;
  allowableMismatchedRatio: number;
  testPath?: string;
  cacheKey?: string;
}

export interface ScreenshotOptions {
  /**
   * When true, takes a screenshot of the full scrollable page.
   * Default: `false`
   */
  fullPage?: boolean;

  /**
   * An object which specifies clipping region of the page.
   */
  clip?: ScreenshotBoundingBox;

  /**
   * Hides default white background and allows capturing screenshots with transparency.
   * Default: `false`
   */
  omitBackground?: boolean;

  /**
   * Matching threshold, ranges from `0` to 1. Smaller values make the comparison
   * more sensitive. Defaults to the testing config `pixelmatchThreshold` value;
   */
  pixelmatchThreshold?: number;
}

export interface ScreenshotBoundingBox {
  /**
   * The x-coordinate of top-left corner.
   */
  x: number;

  /**
   * The y-coordinate of top-left corner.
   */
  y: number;

  /**
   * The width in pixels.
   */
  width: number;

  /**
   * The height in pixels.
   */
  height: number;
}

export interface ServerConfigInput {
  app: ExpressApp;
  configPath?: string;
}

export interface ServerConfigOutput {
  config: Config;
  logger: Logger;
  wwwDir: string;
  destroy?: () => void;
}

export interface ExpressApp {
  use?: Function;
}

export interface MiddlewareConfig {
  config: string | Config;
  destroy?: () => void;
}

export interface StyleCompiler {
  modeName: string;
  styleId: string;
  styleStr: string;
  styleIdentifier: string;
  externalStyles: ExternalStyleCompiler[];
  compiledStyleText: string;
  compiledStyleTextScoped: string;
  compiledStyleTextScopedCommented: string;
}

export interface ExternalStyleCompiler {
  absolutePath: string;
  relativePath: string;
  originalComponentPath: string;
}

export interface CompilerModeStyles {
  [modeName: string]: string[];
}

export interface CssImportData {
  srcImport: string;
  updatedImport?: string;
  url: string;
  filePath?: string;
  altFilePath?: string;
  styleText?: string;
}

export interface CssToEsmImportData {
  srcImportText: string;
  varName: string;
  url: string;
  filePath: string;
}

export interface TransformCssToEsmInput {
  filePath: string;
  code: string;
  tagName: string;
  encapsulation: string;
  modeName: string;
  commentOriginalSelector: boolean;
  sourceMap: boolean;
  minify: boolean;
  autoprefixer: any;
}

export interface TransformCssToEsmOutput {
  styleText: string;
  code: string;
  map: any;
  diagnostics: Diagnostic[];
}

export interface PackageJsonData {
  name?: string;
  version?: string;
  main?: string;
  description?: string;
  bin?: { [key: string]: string };
  browser?: string;
  module?: string;
  'jsnext:main'?: string;
  'collection:main'?: string;
  unpkg?: string;
  collection?: string;
  types?: string;
  files?: string[];
  ['dist-tags']?: {
    latest: string;
  };
  dependencies?: {
    [moduleId: string]: string;
  };
  devDependencies?: {
    [moduleId: string]: string;
  };
  lazyDependencies?: {
    [moduleId: string]: string;
  };
  repository?: {
    type?: string;
    url?: string;
  };
  private?: boolean;
}

export interface Workbox {
  generateSW(swConfig: any): Promise<any>;
  generateFileManifest(): Promise<any>;
  getFileManifestEntries(): Promise<any>;
  injectManifest(swConfig: any): Promise<any>;
  copyWorkboxLibraries(wwwDir: string): Promise<any>;
}

export interface Url {
  href?: string;
  protocol?: string;
  auth?: string;
  hostname?: string;
  host?: string;
  port?: string;
  pathname?: string;
  path?: string;
  search?: string;
  query?: string | any;
  hash?: string;
}


declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Compares HTML, but first normalizes the HTML so all
       * whitespace, attribute order and css class order are
       * the same. When given an element, it will compare
       * the element's `outerHTML`. When given a Document Fragment,
       * such as a Shadow Root, it'll compare its `innerHTML`.
       * Otherwise it'll compare two strings representing HTML.
       */
      toEqualHtml(expectHtml: string): void;

      /**
       * Compares HTML light DOKM only, but first normalizes the HTML so all
       * whitespace, attribute order and css class order are
       * the same. When given an element, it will compare
       * the element's `outerHTML`. When given a Document Fragment,
       * such as a Shadow Root, it'll compare its `innerHTML`.
       * Otherwise it'll compare two strings representing HTML.
       */
      toEqualLightHtml(expectLightHtml: string): void;

      /**
       * When given an element, it'll compare the element's
       * `textContent`. Otherwise it'll compare two strings. This
       * matcher will also `trim()` each string before comparing.
       */
      toEqualText(expectTextContent: string): void;

      /**
       * Checks if an element simply has the attribute. It does
       * not check any values of the attribute
       */
      toHaveAttribute(expectAttrName: string): void;

      /**
       * Checks if an element's attribute value equals the expect value.
       */
      toEqualAttribute(expectAttrName: string, expectAttrValue: any): void;

      /**
       * Checks if an element's has each of the expected attribute
       * names and values.
       */
      toEqualAttributes(expectAttrs: { [attrName: string]: any }): void;

      /**
       * Checks if an element has the expected css class.
       */
      toHaveClass(expectClassName: string): void;

      /**
       * Checks if an element has each of the expected css classes
       * in the array.
       */
      toHaveClasses(expectClassNames: string[]): void;

      /**
       * Checks if an element has the exact same css classes
       * as the expected array of css classes.
       */
      toMatchClasses(expectClassNames: string[]): void;

      /**
       * When given an EventSpy, checks if the event has been
       * received or not.
       */
      toHaveReceivedEvent(): void;

      /**
       * When given an EventSpy, checks how many times the
       * event has been received.
       */
      toHaveReceivedEventTimes(count: number): void;

      /**
       * When given an EventSpy, checks the event has
       * received the correct custom event `detail` data.
       */
      toHaveReceivedEventDetail(eventDetail: any): void;

      /**
       * When given an EventSpy, checks the first event has
       * received the correct custom event `detail` data.
       */
      toHaveFirstReceivedEventDetail(eventDetail: any): void;

      /**
       * When given an EventSpy, checks the event at an index
       * has received the correct custom event `detail` data.
       */
      toHaveNthReceivedEventDetail(index: number, eventDetail: any): void;

      /**
       * Used to evaluate the results of `compareScreenshot()`, such as
       * `expect(compare).toMatchScreenshot()`. The `allowableMismatchedRatio`
       * value from the testing config is used by default if
       * `MatchScreenshotOptions` were not provided.
       */
      toMatchScreenshot(opts?: MatchScreenshotOptions): void;
    }
  }
}


export interface MatchScreenshotOptions {
  /**
   * The `allowableMismatchedPixels` value is the total number of pixels
   * that can be mismatched until the test fails. For example, if the value
   * is `100`, and if there were `101` pixels that were mismatched then the
   * test would fail. If the `allowableMismatchedRatio` is provided it will
   * take precedence, otherwise `allowableMismatchedPixels` will be used.
   */
  allowableMismatchedPixels?: number;

  /**
   * The `allowableMismatchedRatio` ranges from `0` to `1` and is used to
   * determine an acceptable ratio of pixels that can be mismatched before
   * the image is considered to have changes. Realistically, two screenshots
   * representing the same content may have a small number of pixels that
   * are not identical due to anti-aliasing, which is perfectly normal. The
   * `allowableMismatchedRatio` is the number of pixels that were mismatched,
   * divided by the total number of pixels in the screenshot. For example,
   * a ratio value of `0.06` means 6% of the pixels can be mismatched before
   * the image is considered to have changes. If the `allowableMismatchedRatio`
   * is provided it will take precedence, otherwise `allowableMismatchedPixels`
   * will be used.
   */
  allowableMismatchedRatio?: number;
}


export interface EventSpy {
  events: SerializedEvent[];
  eventName: string;
  firstEvent: SerializedEvent;
  lastEvent: SerializedEvent;
  length: number;
  next(): Promise<{
    done: boolean;
    value: SerializedEvent;
  }>;
}


export interface SerializedEvent {
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: any;
  defaultPrevented: boolean;
  detail: any;
  eventPhase: any;
  isTrusted: boolean;
  returnValue: any;
  srcElement: any;
  target: any;
  timeStamp: number;
  type: string;
  isSerializedEvent: boolean;
}


export interface EventInitDict {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}


export interface JestEnvironmentGlobal {
  __NEW_TEST_PAGE__: () => Promise<any>;
  __CLOSE_OPEN_PAGES__: () => Promise<any>;
  Context: any;
  loadTestWindow: (testWindow: any) => Promise<void>;
  h: any;
  resourcesUrl: string;
  currentSpec?: {
    id: string;
    description: string;
    fullName: string;
    testPath: string;
  };
  screenshotDescriptions: Set<string>;
}


export interface E2EProcessEnv {
  STENCIL_COMMIT_ID?: string;
  STENCIL_COMMIT_MESSAGE?: string;
  STENCIL_REPO_URL?: string;
  STENCIL_SCREENSHOT_CONNECTOR?: string;
  STENCIL_SCREENSHOT_SERVER?: string;

  __STENCIL_EMULATE_CONFIGS__?: string;
  __STENCIL_EMULATE__?: string;
  __STENCIL_BROWSER_URL__?: string;
  __STENCIL_APP_SCRIPT_URL__?: string;
  __STENCIL_APP_STYLE_URL__?: string;
  __STENCIL_BROWSER_WS_ENDPOINT__?: string;
  __STENCIL_BROWSER_WAIT_UNTIL?: string;

  __STENCIL_SCREENSHOT__?: 'true';
  __STENCIL_SCREENSHOT_BUILD__?: string;

  __STENCIL_E2E_TESTS__?: 'true';
  __STENCIL_E2E_DEVTOOLS__?: 'true';
  __STENCIL_SPEC_TESTS__?: 'true';

  __STENCIL_PUPPETEER_MODULE__?: string;
  __STENCIL_DEFAULT_TIMEOUT__?: string;
}


export interface ITestingLegacy {
  isValid: boolean;
  runTests(): Promise<boolean>;
  destroy(): Promise<void>;
}



export interface AnyHTMLElement extends HTMLElement {
  [key: string]: any;
}

export interface SpecPage {
  /**
   * Mocked testing `document.body`.
   */
  body: HTMLBodyElement;
  /**
   * Mocked testing `document`.
   */
  doc: HTMLDocument;
  /**
   * The first component found within the mocked `document.body`. If a component isn't found, then it'll return `document.body.firstElementChild`.
   */
  root?: AnyHTMLElement;
  /**
   * Similar to `root`, except returns the component instance. If a root component was not found it'll return `null`.
   */
  rootInstance?: any;
  /**
   * Convenience function to set `document.body.innerHTML` and `waitForChanges()`. Function argument should be an html string.
   */
  setContent: (html: string) => Promise<any>;
  /**
   * After changes have been made to a component, such as a update to a property or attribute, the test page does not automatically apply the changes. In order to wait for, and apply the update, call `await page.waitForChanges()`.
   */
  waitForChanges: () => Promise<any>;
  /**
   * Mocked testing `window`.
   */
  win: Window;

  build: BuildConditionals;
  flushLoadModule: (bundleId?: string) => Promise<any>;
  flushQueue: () => Promise<any>;
  styles: Map<string, string>;
}

export interface NewSpecPageOptions {
  /**
   * An array of components to test. Component classes can be imported into the spec file, then their reference should be added to the `component` array in order to be used throughout the test.
   */
  components: any[];
  /**
   * Sets the mocked `document.cookie`.
   */
  cookie?: string;
  /**
   * Sets the mocked `dir` attribute on `<html>`.
   */
  direction?: string;
  flushQueue?: boolean;
  /**
   * The initial HTML used to generate the test. This can be useful to construct a collection of components working together, and assign HTML attributes. This value sets the mocked `document.body.innerHTML`.
   */
  html?: string;

  /**
   * The initial JSX used to generate the test.
   * Use `template` when you want to initialize a component using their properties, instead of their HTML attributes.
   * It will render the specified template (JSX) into `document.body`.
   */
  template?: () => any;

  /**
   * Sets the mocked `lang` attribute on `<html>`.
   */
  language?: string;
  /**
   * Useful for debugging hydrating components client-side. Sets that the `html` option already includes annotated prerender attributes and comments.
   */
  hydrateClientSide?: boolean;
  /**
   * Useful for debugging hydrating components server-side. The output HTML will also include prerender annotations.
   */
  hydrateServerSide?: boolean;
  /**
   * Sets the mocked `document.referrer`.
   */
  referrer?: string;
  /**
   * Manually set if the mocked document supports Shadow DOM or not. Default is `true`.
   */
  supportsShadowDom?: boolean;
  /**
   * When a component is prerendered it includes HTML annotations, such as `s-id` attributes and `<!-t.0->` comments. This information is used by clientside hydrating. Default is `false`.
   */
  includeAnnotations?: boolean;
  /**
   * Sets the mocked browser's `location.href`.
   */
  url?: string;
  /**
   * Sets the mocked browser's `navigator.userAgent`.
   */
  userAgent?: string;
  /**
   * By default, any changes to component properties and attributes must `page.waitForChanges()` in order to test the updates. As an option, `autoAppluChanges` continuously flushes the queue on the background. Default is `false`.
   */
  autoApplyChanges?: boolean;

  strictBuild?: boolean;
  /** @deprecated */
  context?: { [key: string]: any };
}

export interface TypesImportData {
  [key: string]: TypesMemberNameData[];
}

export interface TypesMemberNameData {
  localName: string;
  importName?: string;
}

export interface TypesModule {
  isDep: boolean;
  tagName: string;
  tagNameAsPascal: string;
  htmlElementName: string;
  component: string;
  jsx: string;
  element: string;
}

export type TypeInfo = {
  name: string,
  type: string;
  optional: boolean;
  required: boolean;
  public: boolean;
  jsdoc?: string;
}[];

export interface Hyperscript {
  (sel: any): VNode;
  (sel: Node, data: VNodeData): VNode;
  (sel: any, data: VNodeData): VNode;
  (sel: any, text: string): VNode;
  (sel: any, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, text: string): VNode;
  (sel: any, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, children: VNode): VNode;
}

export type ChildType = VNode | number | string;

export type PropsType = VNodeProdData | number | string | null;

export interface VNodeProdData {
  key?: string | number;
  class?: { [className: string]: boolean } | string;
  className?: { [className: string]: boolean } | string;
  style?: any;
  [key: string]: any;
}

export interface CompilerWorkerContext {
  compileModule(code: string, opts: CompileOptions): Promise<CompileResults>;
  optimizeCss(inputOpts: OptimizeCssInput): Promise<OptimizeCssOutput>;
  prepareModule(input: string, minifyOpts: any, transpile: boolean, inlineHelpers: boolean): Promise<{ output: string, sourceMap: any, diagnostics: Diagnostic[] }>;
  transformCssToEsm(input: TransformCssToEsmInput): Promise<TransformCssToEsmOutput>;
  transpileToEs5(input: string, inlineHelpers: boolean): Promise<TranspileResults>;
}

export interface MsgToWorker {
  stencilId: number;
  args: any[];
  terminate?: boolean;
}

export interface MsgFromWorker {
  stencilId?: number;
  stencilRtnValue: any;
  stencilRtnError: string;
}

export interface CompilerWorkerTask {
  stencilId?: number;
  inputArgs?: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  retries?: number;
}

export type WorkerMsgHandler = (msgToWorker: MsgToWorker) => Promise<any>;

export interface WorkerTask {
  taskId: number;
  method: string;
  args: any[];
  resolve: (val: any) => any;
  reject: (msg: string) => any;
  retries: number;
  isLongRunningTask: boolean;
  workerKey: string;
}

export interface WorkerMessage {
  taskId?: number;
  method?: string;
  args?: any[];
  value?: any;
  error?: string;
  exit?: boolean;
}

export type WorkerRunner = (methodName: string, args: any[]) => Promise<any>;

export interface WorkerRunnerOptions {
  isLongRunningTask?: boolean;
  workerKey?: string;
}

export interface WorkerContext {
  tsHost?: any;
  tsProgram?: any;
}

export interface TranspileResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: Diagnostic[];
  moduleFile: Module;
  build: BuildConditionals;
}

export interface ValidateTypesResults {
  diagnostics: Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}

export interface TransformOptions {
  coreImportPath: string;
  componentExport: 'lazy' | 'module' | 'customelement' | null;
  componentMetadata: 'runtimestatic' | 'compilerstatic' | null;
  currentDirectory: string;
  file?: string;
  module?: 'cjs' | 'esm';
  proxy: 'defineproperty' | null;
  style: 'static' | null;
  target?: string;
}

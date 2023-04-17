import type { InMemoryFileSystem } from '../compiler/sys/in-memory-fs';
import type {
  BuildEvents,
  BuildLog,
  BuildResultsComponentGraph,
  CompilerBuildResults,
  CompilerBuildStart,
  CompilerFsStats,
  CompilerRequestResponse,
  CompilerSystem,
  Config,
  CopyResults,
  DevServerConfig,
  DevServerEditor,
  Diagnostic,
  Logger,
  LoggerLineUpdater,
  LoggerTimeSpan,
  OptimizeCssInput,
  OptimizeCssOutput,
  OutputTarget,
  OutputTargetWww,
  PageReloadStrategy,
  PrerenderConfig,
  StyleDoc,
  TaskCommand,
} from './stencil-public-compiler';
import type {
  ComponentInterface,
  ListenOptions,
  ListenTargetOptions,
  VNode,
  VNodeData,
} from './stencil-public-runtime';

export interface SourceMap {
  file: string;
  mappings: string;
  names: string[];
  sourceRoot?: string;
  sources: string[];
  sourcesContent?: string[];
  version: number;
}

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

export interface ParsedImport {
  importPath: string;
  basename: string;
  ext: string;
  data: ImportData;
}

export interface ImportData {
  tag?: string;
  encapsulation?: string;
  mode?: string;
}

export interface SerializeImportData extends ImportData {
  importeePath: string;
  importerPath?: string;
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
  /**
   * @deprecated Prevented from new apps, but left in for older collections
   */
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
  invisiblePrehydration?: boolean;
  hydrateServerSide?: boolean;
  hydrateClientSide?: boolean;
  lifecycleDOMEvents?: boolean;
  cssAnnotations?: boolean;
  lazyLoad?: boolean;
  profile?: boolean;
  // TODO(STENCIL-659): Remove code implementing the CSS variable shim
  cssVarShim?: boolean;
  constructableCSS?: boolean;
  appendChildSlotFix?: boolean;
  slotChildNodesFix?: boolean;
  scopedSlotTextContentFix?: boolean;
  cloneNodeFix?: boolean;
  // TODO(STENCIL-661): Remove code related to the dynamic import shim
  dynamicImportShim?: boolean;
  hydratedAttribute?: boolean;
  hydratedClass?: boolean;
  initializeNextTick?: boolean;
  // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
  safari10?: boolean;
  scriptDataOpts?: boolean;
  // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
  shadowDomShim?: boolean;
  asyncQueue?: boolean;
  transformTagName?: boolean;
  attachStyles?: boolean;
}

export type ModuleFormat =
  | 'amd'
  | 'cjs'
  | 'es'
  | 'iife'
  | 'system'
  | 'umd'
  | 'commonjs'
  | 'esm'
  | 'module'
  | 'systemjs';

export interface RollupResultModule {
  id: string;
}
export interface RollupResults {
  modules: RollupResultModule[];
}

export interface UpdatedLazyBuildCtx {
  name: 'esm-browser' | 'esm' | 'cjs' | 'system';
  buildCtx: BuildCtx;
}

export interface BuildCtx {
  buildId: number;
  buildResults: CompilerBuildResults;
  buildStats?: CompilerBuildStats | { diagnostics: Diagnostic[] };
  buildMessages: string[];
  bundleBuildCount: number;
  collections: Collection[];
  compilerCtx: CompilerCtx;
  esmBrowserComponentBundle: ReadonlyArray<BundleModule>;
  esmComponentBundle: ReadonlyArray<BundleModule>;
  es5ComponentBundle: ReadonlyArray<BundleModule>;
  systemComponentBundle: ReadonlyArray<BundleModule>;
  commonJsComponentBundle: ReadonlyArray<BundleModule>;
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
  /**
   * A collection of Stencil's intermediate representation of components, tied to the current build
   */
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

export type BuildStatus = 'pending' | 'error' | 'disabled' | 'default';

export interface CompilerBuildStats {
  timestamp: string;
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
    outputs: any;
  };
  options: {
    minifyJs: boolean;
    minifyCss: boolean;
    hashFileNames: boolean;
    hashedFileNameLength: number;
    buildEs5: boolean | 'prod';
  };
  formats: {
    esmBrowser: ReadonlyArray<CompilerBuildStatBundle>;
    esm: ReadonlyArray<CompilerBuildStatBundle>;
    es5: ReadonlyArray<CompilerBuildStatBundle>;
    system: ReadonlyArray<CompilerBuildStatBundle>;
    commonjs: ReadonlyArray<CompilerBuildStatBundle>;
  };
  components: BuildComponent[];
  entries: EntryModule[];
  rollupResults: RollupResults;
  sourceGraph?: BuildSourceGraph;
  componentGraph: BuildResultsComponentGraph;
  collections: {
    name: string;
    source: string;
    tags: string[];
  }[];
}

export interface CompilerBuildStatBundle {
  key: string;
  components: string[];
  bundleId: string;
  fileName: string;
  imports: string[];
  originalByteSize: number;
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
    };
  };
  name: string;
}

export type SourceTarget = 'es5' | 'es2017' | 'latest';

export interface BundleEntryInputs {
  [entryKey: string]: string;
}

/**
 * A note regarding Rollup types:
 * As of this writing, there is no great way to import external types for packages that are directly embedded in the
 * Stencil source. As a result, some types are duplicated here for Rollup that will be used within the codebase.
 * Updates to rollup may require these typings to be updated.
 */

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
  map?: RollupSourceMap;
}

export interface RollupSourceMap {
  file: string;
  mappings: string;
  names: string[];
  sources: string[];
  sourcesContent: string[];
  version: number;
  toString(): string;
  toUrl(): string;
}

/**
 * Result of Stencil compressing, mangling, and otherwise 'minifying' JavaScript
 */
export type OptimizeJsResult = {
  output: string;
  diagnostics: Diagnostic[];
  sourceMap?: SourceMap;
};

export interface BundleModule {
  entryKey: string;
  rollupResult: RollupChunkResult;
  cmps: ComponentCompilerMeta[];
  output: BundleModuleOutput;
}

export interface BundleModuleOutput {
  bundleId: string;
  fileName: string;
  code: string;
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
}

export type CollectionComponentEntryPath = string;

export interface CollectionBundleManifest {
  components: string[];
}

export interface CollectionDependencyManifest {
  name: string;
  tags: string[];
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
    bundleIds: ModeBundleIds;
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

export interface BuildOutputFile {
  name: string;
  content: string;
}

export type OnCallback = (buildStart: CompilerBuildStart) => void;
export type RemoveCallback = () => boolean;

export interface CompilerCtx {
  version: number;
  activeBuildId: number;
  activeDirsAdded: string[];
  activeDirsDeleted: string[];
  activeFilesAdded: string[];
  activeFilesDeleted: string[];
  activeFilesUpdated: string[];
  addWatchDir: (path: string, recursive: boolean) => void;
  addWatchFile: (path: string) => void;
  cache: Cache;
  cssModuleImports: Map<string, string[]>;
  cachedGlobalStyle: string;
  collections: CollectionCompilerMeta[];
  compilerOptions: any;
  events: BuildEvents;
  fs: InMemoryFileSystem;
  hasSuccessfulBuild: boolean;
  isActivelyBuilding: boolean;
  lastBuildResults: CompilerBuildResults;
  /**
   * A mapping of a file path to a Stencil {@link Module}
   */
  moduleMap: ModuleMap;
  nodeMap: NodeMap;
  resolvedCollections: Set<string>;
  rollupCacheHydrate: any;
  rollupCacheLazy: any;
  rollupCacheNative: any;
  styleModeNames: Set<string>;
  changedModules: Set<string>;
  changedFiles: Set<string>;
  worker?: CompilerWorkerContext;

  rollupCache: Map<string, any>;

  reset(): void;
}

export type NodeMap = WeakMap<any, ComponentCompilerMeta>;

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
  /**
   * @deprecated Prevented from new apps, but left in for older collections
   */
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
  htmlParts: string[];
  isUpdateable: boolean;
  /**
   * A plain component is one that doesn't have:
   * - any members decorated with `@Prop()`, `@State()`, `@Element()`, `@Method()`
   * - any methods decorated with `@Listen()`
   * - any styles
   * - any lifecycle methods, including `render()`
   */
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
  docs: CompilerJsDoc;
  jsFilePath: string;
  sourceMapPath: string;
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

/**
 * Intermediate Representation (IR) of a static property on a Stencil component
 */
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

/**
 * Intermediate Representation (IR) of a property on a Stencil component
 */
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

/**
 * Information about the type of a Stencil-implemented component property, in
 * particular a `@Prop()` or `@Event()`.
 */
export interface ComponentCompilerPropertyComplexType {
  /**
   * The string of the original type annotation in the Stencil source code
   */
  original: string;
  /**
   * A 'resolved' type, where e.g. imported types have been resolved and inlined
   *
   * For instance, an annotation like `(foo: Foo) => string;` will be
   * converted to `(foo: { foo: string }) => string;`.
   */
  resolved: string;
  /**
   * A record of the types which were referenced in the assorted type
   * annotation in the original source file.
   */
  references: ComponentCompilerTypeReferences;
}

/**
 * A record of `ComponentCompilerTypeReference` entities.
 *
 * Each key in this record is intended to be the names of the types used by a component. However, this is not enforced
 * by the type system (I.E. any string can be used as a key).
 *
 * Note any key can be a user defined type or a TypeScript standard type.
 */
export type ComponentCompilerTypeReferences = Record<string, ComponentCompilerTypeReference>;

/**
 * Describes a reference to a type used by a component.
 */
export interface ComponentCompilerTypeReference {
  /**
   * A type may be defined:
   * - locally (in the same file as the component that uses it)
   * - globally
   * - by importing it into a file (and is defined elsewhere)
   */
  location: 'local' | 'global' | 'import';
  /**
   * The path to the type reference, if applicable (global types should not need a path associated with them)
   */
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

/**
 * Representation of JSDoc that is pulled off a node in the AST
 */
export interface CompilerJsDoc {
  /**
   * The text associated with the JSDoc
   */
  text: string;
  /**
   * Tags included in the JSDoc
   */
  tags: CompilerJsDocTagInfo[];
}

/**
 * Representation of a tag that exists in a JSDoc
 */
export interface CompilerJsDocTagInfo {
  /**
   * The name of the tag - e.g. `@deprecated`
   */
  name: string;
  /**
   * Additional text that is associated with the tag - e.g. `@deprecated use v2 of this API`
   */
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

/**
 * A mapping from class member names to a list of methods which are watching
 * them.
 */
export interface ComponentConstructorWatchers {
  [propName: string]: string[];
}

export interface ComponentTestingConstructor extends ComponentConstructor {
  COMPILER_META: ComponentCompilerMeta;
  prototype?: {
    componentWillLoad?: Function;
    componentWillUpdate?: Function;
    componentWillRender?: Function;
    __componentWillLoad?: Function | null;
    __componentWillUpdate?: Function | null;
    __componentWillRender?: Function | null;
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

export type ComponentConstructorPropertyType =
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | 'string'
  | 'boolean'
  | 'number';

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

// TODO(STENCIL-659): Remove code implementing the CSS variable shim
export interface CssVarShim {
  i(): Promise<any>;
  addLink(linkEl: HTMLLinkElement): Promise<any>;
  addGlobalStyle(styleEl: HTMLStyleElement): void;

  createHostStyle(hostEl: HTMLElement, templateName: string, cssText: string, isScoped: boolean): HTMLStyleElement;

  removeHost(hostEl: HTMLElement): void;
  updateHost(hostEl: HTMLElement): void;
  updateGlobal(): void;
}

export interface DevClientWindow extends Window {
  ['s-dev-server']: boolean;
  ['s-initial-load']: boolean;
  ['s-build-id']: number;
  WebSocket: new (socketUrl: string, protos: string[]) => WebSocket;
  devServerConfig?: DevClientConfig;
}

export interface DevClientConfig {
  basePath: string;
  editors: DevServerEditor[];
  reloadStrategy: PageReloadStrategy;
  socketUrl?: string;
}

export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
  acceptHeader: string;
  url: URL;
  searchParams: URLSearchParams;
  pathname?: string;
  filePath?: string;
  stats?: CompilerFsStats;
  headers?: { [name: string]: string };
  host?: string;
}

export interface DevServerMessage {
  startServer?: DevServerConfig;
  closeServer?: boolean;
  serverStarted?: DevServerConfig;
  serverClosed?: boolean;
  buildStart?: boolean;
  buildLog?: BuildLog;
  buildResults?: CompilerBuildResults;
  requestBuildResults?: boolean;
  error?: { message?: string; type?: string; stack?: any };
  isActivelyBuilding?: boolean;
  compilerRequestPath?: string;
  compilerRequestResults?: CompilerRequestResponse;
  requestLog?: {
    method: string;
    url: string;
    status: number;
  };
}

export type DevServerSendMessage = (msg: DevServerMessage) => void;

export interface DevServerContext {
  connectorHtml: string;
  dirTemplate: string;
  getBuildResults: () => Promise<CompilerBuildResults>;
  getCompilerRequest: (path: string) => Promise<CompilerRequestResponse>;
  isServerListening: boolean;
  logRequest: (req: HttpRequest, status: number) => void;
  prerenderConfig: PrerenderConfig;
  serve302: (req: any, res: any, pathname?: string) => void;
  serve404: (req: any, res: any, xSource: string, content?: string) => void;
  serve500: (req: any, res: any, error: any, xSource: string) => void;
  sys: CompilerSystem;
}

export type InitServerProcess = (sendMsg: (msg: DevServerMessage) => void) => (msg: DevServerMessage) => void;

export interface DevResponseHeaders {
  'cache-control'?: string;
  expires?: string;
  'content-type'?: string;
  'content-length'?: number;
  date?: string;
  'access-control-allow-origin'?: string;
  'access-control-expose-headers'?: string;
  'content-encoding'?: 'gzip';
  vary?: 'Accept-Encoding';
  server?: string;
  'x-directory-index'?: string;
  'x-source'?: string;
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

export interface HydrateResults {
  buildId: string;
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
  imgs: HydrateImgElement[];
  scripts: HydrateScriptElement[];
  styles: HydrateStyleElement[];
  staticData: HydrateStaticData[];
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

export interface HydrateImgElement extends HydrateElement {
  src?: string;
}

export interface HydrateScriptElement extends HydrateElement {
  src?: string;
  type?: string;
}

export interface HydrateStyleElement extends HydrateElement {
  href?: string;
}

export interface HydrateStaticData {
  id: string;
  type: string;
  content: string;
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

/**
 * A mapping from a TypeScript or JavaScript source file path on disk, to a Stencil {@link Module}.
 *
 * It is advised that the key (path) be normalized before storing/retrieving the `Module` to avoid unnecessary lookup
 * failures.
 */
export type ModuleMap = Map<string, Module>;

/**
 * Stencil's Intermediate Representation (IR) of a module, bundling together
 * various pieces of information like the classes declared within it, the path
 * to the original source file, HTML tag names defined in the file, and so on.
 *
 * Note that this gets serialized/parsed as JSON and therefore cannot contain a
 * `Map` or a `Set`.
 */
export interface Module {
  cmps: ComponentCompilerMeta[];
  /**
   * A collection of modules that a component will need. The modules in this list must have import statements generated
   * in order for the component to function.
   */
  coreRuntimeApis: string[];
  /**
   * A collection of modules that a component will need for a specific output target. The modules in this list must
   * have import statements generated in order for the component to function, but only for a specific output target.
   */
  outputTargetCoreRuntimeApis: Partial<Record<OutputTarget['type'], string[]>>;
  collectionName: string;
  dtsFilePath: string;
  excludeFromCollection: boolean;
  externalImports: string[];
  htmlAttrNames: string[];
  htmlTagNames: string[];
  htmlParts: string[];
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
  sourceMapPath: string;
  sourceMapFileText: string;

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
  transform?: (
    sourceText: string,
    id: string,
    context: PluginCtx
  ) => Promise<PluginTransformResults> | PluginTransformResults | string;
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
  sys: CompilerSystem;
  fs: InMemoryFileSystem;
  cache: Cache;
  diagnostics: Diagnostic[];
}

export interface PrerenderUrlResults {
  anchorUrls: string[];
  diagnostics: Diagnostic[];
  filePath: string;
}

export interface PrerenderUrlRequest {
  appDir: string;
  buildId: string;
  baseUrl: string;
  componentGraphPath: string;
  devServerHostUrl: string;
  hydrateAppFilePath: string;
  isDebug: boolean;
  prerenderConfigPath: string;
  staticSite: boolean;
  templateId: string;
  url: string;
  writeToFilePath: string;
}

export interface PrerenderManager {
  config: Config;
  prerenderUrlWorker: (prerenderRequest: PrerenderUrlRequest) => Promise<PrerenderUrlResults>;
  devServerHostUrl: string;
  diagnostics: Diagnostic[];
  hydrateAppFilePath: string;
  isDebug: boolean;
  logCount: number;
  outputTarget: OutputTargetWww;
  prerenderConfig: PrerenderConfig;
  prerenderConfigPath: string;
  progressLogger?: LoggerLineUpdater;
  resolve: Function;
  staticSite: boolean;
  templateId: string;
  componentGraphPath: string;
  urlsProcessing: Set<string>;
  urlsPending: Set<string>;
  urlsCompleted: Set<string>;
  maxConcurrency: number;
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
   * This is a node that represents where a slot
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
  ['s-en']?: '' | /*shadow*/ 'c' /*scoped*/;
}

export type LazyBundlesRuntimeData = LazyBundleRuntimeData[];

export type LazyBundleRuntimeData = [
  /** bundleIds */
  string,
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

/**
 * Runtime metadata for a Stencil component
 */
export interface ComponentRuntimeMeta {
  /**
   * This number is used to hold a series of bitflags for various features we
   * support on components. The flags which this value is intended to store are
   * documented in the {@link CMP_FLAGS} enum.
   */
  $flags$: number;
  /**
   * Just what it says on the tin - the tag name for the component, as set in
   * the `@Component` decorator.
   */
  $tagName$: string;
  /**
   * A map of the component's members, which could include fields decorated
   * with `@Prop`, `@State`, etc as well as methods.
   */
  $members$?: ComponentRuntimeMembers;
  /**
   * Information about listeners on the component.
   */
  $listeners$?: ComponentRuntimeHostListener[];
  /**
   * Tuples containing information about `@Prop` fields on the component which
   * are set to be reflected (i.e. kept in sync) as HTML attributes when
   * updated.
   */
  $attrsToReflect$?: ComponentRuntimeReflectingAttr[];
  /**
   * Information about which class members have watchers attached on the component.
   */
  $watchers$?: ComponentConstructorWatchers;
  /**
   * A bundle ID used for lazy loading.
   */
  $lazyBundleId$?: string;
}

/**
 * A mapping of the names of members on the component to some runtime-specific
 * information about them.
 */
export interface ComponentRuntimeMembers {
  [memberName: string]: ComponentRuntimeMember;
}

/**
 * A tuple with information about a class member that's relevant at runtime.
 * The fields are:
 *
 * 1. A number used to hold bitflags for component members. The bit flags which
 * this is intended to store are documented in the {@link MEMBER_FLAGS} enum.
 * 2. The attribute name to observe.
 */
export type ComponentRuntimeMember = [number, string?];

/**
 * A tuple holding information about a host listener which is relevant at
 * runtime. The field are:
 *
 * 1. A number used to hold bitflags for listeners. The bit flags which this is
 * intended to store are documented in the {@link LISTENER_FLAGS} enum.
 * 2. The event name.
 * 3. The method name.
 */
export type ComponentRuntimeHostListener = [number, string, string];

/**
 * A tuple containing information about props which are "reflected" at runtime,
 * meaning that HTML attributes on the component instance are kept in sync with
 * the prop value.
 *
 * The fields are:
 *
 * 1. the prop name
 * 2. the prop attribute.
 */
export type ComponentRuntimeReflectingAttr = [string, string | undefined];

export type ModeBundleId = ModeBundleIds | string;

export interface ModeBundleIds {
  [modeName: string]: string;
}

export type RuntimeRef = HostElement | {};

/**
 * Interface used to track an Element, it's virtual Node (`VNode`), and other data
 */
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
  // TODO(STENCIL-659): Remove code implementing the CSS variable shim
  $cssShim$?: CssVarShim;
  $flags$: number;
  $orgLocNodes$?: Map<string, RenderNode>;
  $resourcesUrl$: string;
  /**
   * The nonce value to be applied to all script/style tags at runtime.
   * If `null`, the nonce attribute will not be applied.
   */
  $nonce$?: string | null;
  jmp: (c: Function) => any;
  raf: (c: FrameRequestCallback) => number;
  ael: (
    el: EventTarget,
    eventName: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions
  ) => void;
  rel: (
    el: EventTarget,
    eventName: string,
    listener: EventListenerOrEventListenerObject,
    options: boolean | AddEventListenerOptions
  ) => void;
  ce: (eventName: string, opts?: any) => CustomEvent;
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
  updateScreenshotCache(
    screenshotCache: ScreenshotCache,
    buildResults: ScreenshotBuildResults
  ): Promise<ScreenshotCache>;
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
  filePath: string;
  altFilePath?: string;
  styleText?: string | null;
}

export interface CssToEsmImportData {
  srcImportText: string;
  varName: string;
  url: string;
  filePath: string;
}

/**
 * Input CSS to be transformed into ESM
 */
export interface TransformCssToEsmInput {
  input: string;
  module?: 'cjs' | 'esm' | string;
  file?: string;
  tag?: string;
  encapsulation?: string;
  mode?: string;
  commentOriginalSelector?: boolean;
  sourceMap?: boolean;
  minify?: boolean;
  docs?: boolean;
  autoprefixer?: any;
  styleImportData?: string;
}

export interface TransformCssToEsmOutput {
  styleText: string;
  output: string;
  map: any;
  diagnostics: Diagnostic[];
  defaultVarName: string;
  styleDocs: StyleDoc[];
  imports: { varName: string; importPath: string }[];
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
  repository?: {
    type?: string;
    url?: string;
  };
  private?: boolean;
  scripts?: {
    [runName: string]: string;
  };
  license?: string;
  keywords?: string[];
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
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars --
     * these type params need to be here for compatibility with Jest, but we aren't using them for anything
     */
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
  env: { [prop: string]: string };
  screenshotDescriptions: Set<string>;
}

export interface E2EProcessEnv {
  STENCIL_COMMIT_ID?: string;
  STENCIL_COMMIT_MESSAGE?: string;
  STENCIL_REPO_URL?: string;
  STENCIL_SCREENSHOT_CONNECTOR?: string;
  STENCIL_SCREENSHOT_SERVER?: string;

  __STENCIL_EMULATE_CONFIGS__?: string;
  __STENCIL_ENV__?: string;
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
  __STENCIL_PUPPETEER_VERSION__?: number;
  __STENCIL_DEFAULT_TIMEOUT__?: string;

  /**
   * Property for injecting transformAliasedImportPaths into the Jest context
   */
  __STENCIL_TRANSPILE_PATHS__?: 'true' | 'false';
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
   * Convenience function to set `document.body.innerHTML` and `waitForChanges()`. Function argument should be a HTML string.
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

/**
 * Options pertaining to the creation and functionality of a {@link SpecPage}
 */
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
  /**
   * If `false`, do not flush the render queue on initial test setup.
   */
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
   * When a component is pre-rendered it includes HTML annotations, such as `s-id` attributes and `<!-t.0->` comments. This information is used by clientside hydrating. Default is `false`.
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
  /**
   * By default, styles are not attached to the DOM and they are not reflected in the serialized HTML.
   * Setting this option to `true` will include the component's styles in the serializable output.
   */
  attachStyles?: boolean;
  /**
   * Set {@link BuildConditionals} for testing based off the metadata of the component under test.
   * When `true` all `BuildConditionals` will be assigned to the global testing `BUILD` object, regardless of their
   * value. When `false`, only `BuildConditionals` with a value of `true` will be assigned to the `BUILD` object.
   */
  strictBuild?: boolean;
  /**
   * Default values to be set on the platform runtime object {@see PlatformRuntime} when creating
   * the spec page.
   */
  platform?: Partial<PlatformRuntime>;
}

/**
 * A record of `TypesMemberNameData` entities.
 *
 * Each key in this record is intended to be the path to a file that declares one or more types used by a component.
 * However, this is not enforced by the type system - users of this interface should not make any assumptions regarding
 * the format of the path used as a key (relative vs. absolute)
 */
export interface TypesImportData {
  [key: string]: TypesMemberNameData[];
}

/**
 * A type describing how Stencil may alias an imported type to avoid naming collisions when performing operations such
 * as generating `components.d.ts` files.
 */
export interface TypesMemberNameData {
  /**
   * The name of the type as it's used within a file.
   */
  localName: string;
  /**
   * An alias that Stencil may apply to the `localName` to avoid naming collisions. This name does not appear in the
   * file that is using `localName`.
   */
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
  name: string;
  type: string;
  optional: boolean;
  required: boolean;
  internal: boolean;
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
  optimizeCss(inputOpts: OptimizeCssInput): Promise<OptimizeCssOutput>;
  prepareModule(
    input: string,
    minifyOpts: any,
    transpile: boolean,
    inlineHelpers: boolean
  ): Promise<{ output: string; diagnostics: Diagnostic[]; sourceMap?: SourceMap }>;
  prerenderWorker(prerenderRequest: PrerenderUrlRequest): Promise<PrerenderUrlResults>;
  transformCssToEsm(input: TransformCssToEsmInput): Promise<TransformCssToEsmOutput>;
}

export interface MsgToWorker {
  stencilId: number;
  args: any[];
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

export interface TranspileModuleResults {
  sourceFilePath: string;
  code: string;
  map: any;
  diagnostics: Diagnostic[];
  moduleFile: Module;
}

export interface ValidateTypesResults {
  diagnostics: Diagnostic[];
  dirPaths: string[];
  filePaths: string[];
}

export interface TerminalInfo {
  /**
   * Whether this is in CI or not.
   */
  readonly ci: boolean;
  /**
   * Whether the terminal is an interactive TTY or not.
   */
  readonly tty: boolean;
}

/**
 * The task to run in order to collect the duration data point.
 */
export type TelemetryCallback = (...args: any[]) => void | Promise<void>;

/**
 * The model for the data that's tracked.
 */
export interface TrackableData {
  arguments: string[];
  build: string;
  component_count?: number;
  config: Config;
  cpu_model: string | undefined;
  duration_ms: number | undefined;
  has_app_pwa_config: boolean;
  is_browser_env: boolean;
  os_name: string | undefined;
  os_version: string | undefined;
  packages: string[];
  packages_no_versions?: string[];
  rollup: string;
  stencil: string;
  system: string;
  system_major?: string;
  targets: string[];
  task: TaskCommand | null;
  typescript: string;
  yarn: boolean;
}

/**
 * Used as the object sent to the server. Value is the data tracked.
 */
export interface Metric {
  name: string;
  timestamp: string;
  source: 'stencil_cli';
  value: TrackableData;
  session_id: string;
}
export interface TelemetryConfig {
  'telemetry.stencil'?: boolean;
  'tokens.telemetry'?: string;
}

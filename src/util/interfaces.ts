import { CssClassMap } from './jsx-interfaces';
export { CssClassMap } from './jsx-interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE, RUNTIME_ERROR } from './constants';


export interface CoreContext {
  attr?: number;
  emit?: (elm: Element, eventName: string, data?: EventEmitterData) => void;
  enableListener?: EventListenerEnable;
  eventNameFn?: (eventName: string) => string;
  isClient?: boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  window?: Window;
  location?: Location;
  document?: Document;
  mode?: string;
  [contextId: string]: any;
}


export interface AppGlobal {
  components?: LoadComponentRegistry[];
  loadComponents?: (importFn: CjsImporterFn, bundleId: string) => void;
  h?: Function;
  Context?: any;
}


export interface CjsImporterFn {
  (exports: CjsExports, h: Function, Context: any): void;
}


export interface AddEventListener {
  (elm: Element|Document|Window, eventName: string, cb: EventListenerCallback, opts?: ListenOptions): Function;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string|Element): void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface EventEmitter<T= any> {
  emit: (data?: T) => void;
}


export interface QueueApi {
  add: (cb: Function, priority?: number) => void;
  flush?: (cb?: Function) => void;
}


export interface Now {
  (): number;
}


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface DomControllerCallback {
  (cb: RafCallback): void;
}


export interface LoadComponentRegistry {
  /**
   * tag name (ion-badge)
   */
  [0]: string;

  /**
   * map of bundle ids
   */
  [1]: {
    [modeName: string]: any[];
  };

  /**
   * has styles
   */
  [2]: boolean;

  /**
   * members
   */
  [3]: ComponentMemberData[];

  /**
   * encapsulated
   */
  [4]: ENCAPSULATION;

  /**
   * listeners
   */
  [5]: ComponentListenersData[];
}


export interface ComponentMemberData {
  /**
   * member name
   */
  [0]: string;

  /**
   * member type
   */
  [1]: number;

  /**
   * is attribute to observe
   */
  [2]: number;

  /**
   * prop type
   */
  [3]: number;

  /**
   * controller id
   */
  [4]: string;
}


export interface ComponentListenersData {
  /**
   * methodName
   */
  [0]: string;

  /**
   * eventName
   */
  [1]: string;

  /**
   * capture
   */
  [2]: number;

  /**
   * passive
   */
  [3]: number;

  /**
   * enabled
   */
  [4]: number;
}


export interface ComponentEventData {
  /**
   * eventName
   */
  [0]: string;

  /**
   * instanceMethodName
   */
  [1]: string;

  /**
   * eventBubbles
   */
  [2]: number;

  /**
   * eventCancelable
   */
  [3]: number;

  /**
   * eventComposed
   */
  [4]: number;
}


export interface Manifest {
  manifestName?: string;
  modulesFiles?: ModuleFile[];
  bundles?: ManifestBundle[];
  global?: ModuleFile;
  dependentManifests?: Manifest[];
  compiler?: ManifestCompiler;
}


export interface ManifestBundle {
  components: string[];
}


export interface ManifestCompiler {
  name: string;
  version: string;
  typescriptVersion?: string;
}


export interface ModuleFile {
  tsFilePath?: string;
  tsText?: string;
  dtsFilePath?: string;
  jsFilePath?: string;
  cmpMeta?: ComponentMeta;
  includedSassFiles?: string[];
  isCollectionDependency?: boolean;
  excludeFromCollection?: boolean;
  originalCollectionComponentPath?: string;
}


export interface AppRegistry {
  namespace?: string;
  fsNamespace?: string;
  loader?: string;
  core?: string;
  coreSsr?: string;
  corePolyfilled?: string;
  global?: string;
  components?: AppRegistryComponents;
}


export interface AppRegistryComponents {
  [tagName: string]: BundleIds;
}


export interface Bundle {
  entryKey?: string;
  moduleFiles: ModuleFile[];
  compiledModuleText?: string;
  compiledModuleLegacyText?: string;
  requiresScopedStyles?: boolean;
  modeNames?: string[];
}


export interface BuildConditionals {
  coreId?: 'core' | 'core.ssr' | 'core.pf';
  polyfills?: boolean;
  verboseError: boolean;
  es5?: boolean;
  cssVarShim?: boolean;
  clientSide?: boolean;

  // ssr
  ssrClientSide: boolean;
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


export type SourceTarget = 'es5' | 'es2015';


export interface BuildConfig {
  configPath?: string;
  sys?: StencilSystem;
  logger?: Logger;
  rootDir?: string;
  logLevel?: 'error'|'warn'|'info'|'debug'|string;
  buildEs5?: boolean;
  namespace?: string;
  fsNamespace?: string;
  globalScript?: string;
  globalStyle?: string[];
  srcDir?: string;
  wwwDir?: string;
  buildDir?: string;
  distDir?: string;
  collectionDir?: string;
  typesDir?: string;
  emptyDist?: boolean;
  emptyWWW?: boolean;
  srcIndexHtml?: string;
  wwwIndexHtml?: string;
  publicPath?: string;
  generateDistribution?: boolean;
  generateWWW?: boolean;
  bundles?: ManifestBundle[];
  collections?: DependentCollection[];
  devMode?: boolean;
  watch?: boolean;
  hashFileNames?: boolean;
  minifyCss?: boolean;
  minifyJs?: boolean;
  preamble?: string;
  hashedFileNameLength?: number;
  suppressTypeScriptErrors?: boolean;
  watchIgnoredRegex?: RegExp;
  prerender?: PrerenderConfig|boolean;
  copy?: CopyTasks;
  serviceWorker?: ServiceWorkerConfig|boolean;
  hydratedCssClass?: string;
  sassConfig?: any;
  generateDocs?: boolean;
  includeSrc?: string[];
  excludeSrc?: string[];
  _isValidated?: boolean;
  _isTesting?: boolean;
}


export interface ServiceWorkerConfig {
  // https://workboxjs.org/reference-docs/latest/module-workbox-build.html#.Configuration
  swDest?: string;
  swSrc?: string;
  globPatterns?: string[];
  globDirectory?: string|string[];
  globIgnores?: string|string[];
  templatedUrls?: any;
  maximumFileSizeToCacheInBytes?: number;
  manifestTransforms?: any;
  modifyUrlPrefix?: any;
  dontCacheBustUrlsMatching?: any;
  navigateFallback?: string;
  navigateFallbackWhitelist?: any[];
  cacheId?: string;
  skipWaiting?: boolean;
  clientsClaim?: boolean;
  directoryIndex?: string;
  runtimeCaching?: any[];
  ignoreUrlParametersMatching?: any[];
  handleFetch?: boolean;
}


export interface CopyTasks {
  [copyTaskName: string]: CopyTask;
}


export interface CopyTask {
  src?: string;
  dest?: string;
  filter?: (from?: string, to?: string) => boolean;
  isDirectory?: boolean;
  warn?: boolean;
}


export interface RenderOptions {
  canonicalLink?: boolean;
  collapseWhitespace?: boolean;
  inlineAssetsMaxSize?: number;
  inlineLoaderScript?: boolean;
  inlineStyles?: boolean;
  removeUnusedStyles?: boolean;
  ssrIds?: boolean;
  userAgent?: string;
  cookie?: string;
  dir?: string;
  lang?: string;
}


export interface PrerenderConfig extends RenderOptions {
  crawl?: boolean;
  include?: PrerenderLocation[];
  prerenderDir?: string;
  maxConcurrent?: number;
  includePathHash?: boolean;
  includePathQuery?: boolean;
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


export interface PrerenderLocation {
  url?: string;
  path?: string;
  status?: PrerenderStatus;
}


export enum PrerenderStatus {
  pending = 1,
  processing = 2,
  complete = 3
}


export interface HydrateOptions extends RenderOptions {
  req?: {
    protocol: string;
    get: (key: string) => string;
    originalUrl: string;
  };
  html?: string;
  url?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  cookie?: string;
  dir?: string;
  lang?: string;
  isPrerender?: boolean;
  serializeHtml?: boolean;
  collectAnchors?: boolean;
  console?: {
    [level: string]: (...msgs: string[]) => void;
  };
}


export interface BuildResults {
  files: string[];
  diagnostics: Diagnostic[];
  manifest: ManifestData;
  changedFiles?: string[];
}


export interface BuildContext {
  moduleFiles?: ModuleFiles;
  jsFiles?: FilesMap;
  compiledFileCache?: FilesMap;
  rollupCache?: { [cacheKey: string]: any };
  moduleBundleOutputs?: ModuleBundles;
  moduleBundleLegacyOutputs?: ModuleBundles;
  filesToWrite?: FilesMap;
  dependentManifests?: {[collectionName: string]: Manifest};
  appFiles?: {
    loader?: string;
    loaderContent?: string;
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
    indexHtml?: string;
    components_d_ts?: string;
    [key: string]: string;
  };
  appGlobalStyles?: {
    content?: string;
  };
  appCoreWWWPath?: string;
  coreBuilds?: {[cacheKey: string]: string};
  watcher?: FSWatcher;
  hasIndexHtml?: boolean;

  isRebuild?: boolean;
  isChangeBuild?: boolean;
  lastBuildHadError?: boolean;
  changeHasNonComponentModules?: boolean;
  changeHasComponentModules?: boolean;
  changeHasSass?: boolean;
  changeHasCss?: boolean;
  changeHasHtml?: boolean;
  changedFiles?: string[];

  sassBuildCount?: number;
  transpileBuildCount?: number;
  indexBuildCount?: number;
  appFileBuildCount?: number;

  moduleBundleCount?: number;
  localPrerenderServer?: any;

  diagnostics?: Diagnostic[];
  manifest?: Manifest;
  onFinish?: (buildResults: BuildResults) => void;
}


export interface ModuleFiles {
  [filePath: string]: ModuleFile;
}


export interface ModuleBundles {
  [bundleId: string]: string;
}


export interface CompileResults {
  moduleFiles: ModuleFiles;
  includedSassFiles?: string[];
}


export interface TranspileModulesResults {
  moduleFiles: ModuleFiles;
}


export interface TranspileResults {
  code: string;
  diagnostics: Diagnostic[];
  cmpMeta?: ComponentMeta;
}


export interface DependentCollection {
  name: string;
  includeBundledOnly?: boolean;
}


export interface Logger {
  level: string;
  debug(...msg: any[]): void;
  info(...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
  createTimeSpan(startMsg: string, debug?: boolean): LoggerTimeSpan;
  printDiagnostics(diagnostics: Diagnostic[]): void;
  red(msg: string): string;
  green(msg: string): string;
  yellow(msg: string): string;
  blue(msg: string): string;
  magenta(msg: string): string;
  cyan(msg: string): string;
  gray(msg: string): string;
  bold(msg: string): string;
  dim(msg: string): string;
}


export interface LoggerTimeSpan {
  finish(finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean): void;
}


export interface CjsExports {
  [moduleId: string]: ComponentConstructor;
}


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrl?: string;
  styleUrls?: string[] | ModeStyles;
  styles?: string;
  scoped?: boolean;
  shadow?: boolean;
  host?: HostMeta;
  assetsDir?: string;
  assetsDirs?: string[];
}


export interface ModeStyles {
  [modeName: string]: string | string[];
}


export interface PropDecorator {
  (opts?: PropOptions): any;
}


export interface PropOptions {
  context?: string;
  connect?: string;
  mutable?: boolean;

  /**
   * "state" has been deprecated. Please use "mutable" instead.
   */
  state?: boolean;
}


export interface MembersMeta {
  [memberName: string]: MemberMeta;
}

export interface AttributeTypeReference {
  referenceLocation: 'local' | 'global' | 'import';
  importReferenceLocation?: string;
}

export interface AttributeTypeInfo {
  text: string;
  typeReferences?: {
    [key: string]: AttributeTypeReference;
  };
}

export interface MemberMeta {
  memberType?: MEMBER_TYPE;
  propType?: PROP_TYPE;
  attribName?: string;
  attribType?: AttributeTypeInfo;
  ctrlId?: string;
  jsdoc?: JSDoc;
  watchCallbacks?: string[];
}


export interface ImportedModule {
  [pascalCaseTag: string]: ComponentConstructor;
}


export interface ComponentConstructor {
  is?: string;
  properties?: ComponentConstructorProperties;
  events?: ComponentConstructorEvent[];
  host?: any;
  style?: string;
  styleMode?: string;
  encapsulation?: Encapsulation;
}


export type Encapsulation = 'shadow' | 'scoped' | 'none';


export interface ComponentConstructorProperties {
  [propName: string]: ComponentConstructorProperty;
}


export interface ComponentConstructorProperty {
  attr?: string;
  connect?: string;
  context?: string;
  elementRef?: boolean;
  method?: boolean;
  mutable?: boolean;
  state?: boolean;
  type?: PropertyType;
  watchCallbacks?: string[];
}

export type PropertyType = StringConstructor | BooleanConstructor | NumberConstructor | 'Any';


export interface ComponentConstructorEvent {
  name: string;
  method: string;
  bubbles: boolean;
  cancelable: boolean;
  composed: boolean;
}



export interface MethodDecorator {
  (opts?: MethodOptions): any;
}


export interface MethodOptions {}


export interface ElementDecorator {
  (): any;
}


export interface EventDecorator {
  (opts?: EventOptions): any;
}


export interface EventOptions {
  eventName?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}


export interface EventMeta {
  eventName: string;
  eventMethodName: string;
  eventBubbles: boolean;
  eventCancelable: boolean;
  eventComposed: boolean;
  jsdoc?: JSDoc;
}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOptions): any;
}


export interface ListenOptions {
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}


export interface ListenMeta {
  eventMethodName?: string;
  eventName?: string;
  eventCapture?: boolean;
  eventPassive?: boolean;
  eventDisabled?: boolean;
  jsdoc?: JSDoc;
}


export interface StateDecorator {
  (): any;
}


export interface WatchDecorator {
  (propName: string): any;
}


export interface PropChangeOpts {
  fn: string;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  bundleIds?: BundleIds;
  stylesMeta?: StylesMeta;
  membersMeta?: MembersMeta;
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  hostMeta?: HostMeta;
  encapsulation?: ENCAPSULATION;
  assetsDirsMeta?: AssetsMeta[];
  componentConstructor?: ComponentConstructor;
  componentClass?: string;
  jsdoc?: JSDoc;
}


export interface JSDoc {
  name: string;
  documentation: string;
  type: string;
}


export interface BundleIds {
  [modeName: string]: string;
}


export interface StylesMeta {
  [modeName: string]: StyleMeta;
}


export interface StyleMeta {
  styleId?: string;
  absolutePaths?: string[];
  cmpRelativePaths?: string[];
  originalComponentPaths?: string[];
  originalCollectionPaths?: string[];
  styleStr?: string;
  compiledStyleText?: string;
  compiledStyleTextScoped?: string;
}


export interface AssetsMeta {
  absolutePath?: string;
  cmpRelativePath?: string;
  originalComponentPath?: string;
  originalCollectionPath?: string;
}


export interface HostMeta {
  [key: string]: any;
}


export interface ComponentInstance {
  componentWillLoad?: () => Promise<void>;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => Promise<void>;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;

  render?: () => any;
  hostData?: () => VNodeData;

  mode?: string;
  color?: string;

  // private properties
  __el?: HostElement;

  [memberName: string]: any;
}


export abstract class ComponentModule {
  abstract componentWillLoad?: () => Promise<void>;
  abstract componentDidLoad?: () => void;
  abstract componentWillUpdate?: () => Promise<void>;
  abstract componentDidUpdate?: () => void;
  abstract componentDidUnload?: () => void;

  abstract render?: () => any;
  abstract hostData?: () => VNodeData;

  abstract mode?: string;
  abstract color?: string;

  abstract __el?: HostElement;

  [memberName: string]: any;

  abstract get is(): string;
  abstract get properties(): string;
}


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export interface ComponentActivePropChanges {
  [propName: string]: Function;
}


export interface ComponentInternalValues {
  [propName: string]: any;
}


export interface BaseInputComponent extends ComponentInstance {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: () => void;
  fireBlur: () => void;
}


export interface BooleanInputComponent extends BaseInputComponent {
  checked: boolean;
  toggle: (ev: UIEvent) => void;
}


export interface ComponentModule {
  new (): ComponentInstance;
}


export interface ComponentRegistry {
  // registry tag must always be lower-case
  [tagName: string]: ComponentMeta;
}


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;
  forceUpdate: () => void;

  // public members which can be used externally and should
  // not be property renamed (these should all be in externs)
  // HOWEVER!!! Don't use these :)
  $activeLoading?: HostElement[];
  $connected?: boolean;
  $defaultHolder?: Comment;
  $initLoad: () => void;
  $rendered?: boolean;
  $onRender: (() => void)[];
  componentOnReady?: (cb?: (elm: HostElement) => void) => Promise<void>;
  color?: string;
  mode?: string;

  // private members which are only internal to
  // this runtime and can be safely property renamed
  _ancestorHostElement?: HostElement;
  _appliedStyles?: { [tagNameForStyles: string]: boolean };
  _hasDestroyed?: boolean;
  _hasLoaded?: boolean;
  _hostContentNodes?: HostContentNodes;
  _instance?: ComponentInstance;
  _isQueuedForUpdate?: boolean;
  _observer?: MutationObserver;
  _onReadyCallbacks: ((elm: HostElement) => void)[];
  _queuedEvents?: any[];
  _root?: HTMLElement | ShadowRoot;
  _values?: ComponentInternalValues;
  _vnode: VNode;
}


export interface RendererApi {
  (oldVNode: VNode | Element, newVNode: VNode, isUpdate?: boolean, hostContentNodes?: HostContentNodes, encapsulation?: Encapsulation, ssrId?: number): VNode;
}


export interface DomApi {
  $documentElement: HTMLElement;
  $head: HTMLHeadElement;
  $body: HTMLElement;
  $nodeType(node: any): number;
  $createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  $createElement(tagName: any): HTMLElement;
  $createElementNS(namespace: string, tagName: any): any;
  $createTextNode(text: string): Text;
  $createComment(data: string): Comment;
  $insertBefore(parentNode: Node, childNode: Node, referenceNode: Node): void;
  $removeChild(parentNode: Node, childNode: Node): Node;
  $appendChild(parentNode: Node, childNode: Node): void;
  $childNodes(node: Node): NodeList;
  $parentNode(node: Node): Node;
  $nextSibling(node: Node): Node;
  $tagName(elm: any): string;
  $getTextContent(node: any): string;
  $setTextContent(node: Node, text: string): void;
  $getAttribute(elm: any, key: string): string;
  $setAttribute(elm: any, key: string, val: any): void;
  $setAttributeNS(elm: any, namespaceURI: string, qualifiedName: string, value: string): void;
  $removeAttribute(elm: any, key: string): void;
  $elementRef?(elm: any, referenceName: string): any;
  $parentElement?(node: Node): any;
  $addEventListener?(elm: any, eventName: string, eventListener: any, useCapture?: boolean, usePassive?: boolean, attachTo?: string|Element): void;
  $removeEventListener?(elm: any, eventName?: string): any;
  $dispatchEvent?(elm: Element, eventName: string, data: any): void;
  $supportsShadowDom?: boolean;
  $supportsEventOptions?: boolean;
  $attachShadow?(elm: any, shadowRootInitDict: ShadowRootInit): any;
}

export type Key = string | number;


export interface HostContentNodes {
  defaultSlot?: Node[];
  namedSlots?: {[slotName: string]: Node[]};
}


export interface VNode {
  // using v prefixes largely so closure has no issue property renaming
  vtag?: string | number;
  vkey?: string | number;
  vtext?: string;
  vchildren?: VNode[];
  vattrs?: any;
  vref?: (elm: any) => void;
  elm?: Element|Node;
}

export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: CssClassMap;
  style?: any;
  on?: any;
  key?: Key;
  ns?: any; // for SVGs
}

/**
 * used by production compiler
 */
export interface VNodeProdData {
  key?: Key;
  class?: CssClassMap | string;
  className?: CssClassMap | string;
  style?: any;
  [key: string]: any;
}


export interface PlatformApi {
  activeRender?: boolean;
  attachStyles?: (domApi: DomApi, cmpConstructor: ComponentConstructor, modeName: string, elm: HostElement) => void;
  connectHostElement: (cmpMeta: ComponentMeta, elm: HostElement) => void;
  defineComponent: (cmpMeta: ComponentMeta, HostElementConstructor?: any) => void;
  domApi?: DomApi;
  emitEvent: (elm: Element, eventName: string, data: EventEmitterData) => void;
  getComponentMeta: (elm: Element) => ComponentMeta;
  getContextItem: (contextKey: string) => any;
  isClient?: boolean;
  isDefinedComponent?: (elm: Element) => boolean;
  isPrerender?: boolean;
  isServer?: boolean;
  loadBundle: (cmpMeta: ComponentMeta, modeName: string, cb: Function) => void;
  onAppLoad?: (rootElm: HostElement, styles: string[], failureDiagnostic?: Diagnostic) => void;
  onError: (err: Error, type?: RUNTIME_ERROR, elm?: HostElement, appFailure?: boolean) => void;
  propConnect: (ctrlTag: string) => PropConnect;
  queue: QueueApi;
  registerComponents?: (components?: LoadComponentRegistry[]) => ComponentMeta[];
  render?: RendererApi;
  tmpDisconnected?: boolean;
}


export interface PropConnect {
  create(opts?: any): Promise<any>;
  componentOnReady(): Promise<any>;
  componentOnReady(done: (cmp: any) => void): any;
}


export interface EventEmitterData<T = any> {
  detail?: T;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}


export interface RequestIdleCallback {
  (callback: IdleCallback, options?: { timeout?: number }): number;
}


export interface IdleCallback {
  (deadline: IdleDeadline, options?: IdleOptions): void;
}


export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}


export interface IdleOptions {
  timeout?: number;
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}


export interface Diagnostic {
  level: 'error'|'warn'|'info'|'log'|'debug';
  type: string;
  header?: string;
  messageText: string;
  language?: 'javascript'|'typescript'|'scss'|'css';
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lines?: PrintLine[];
}


export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  html?: string;
  errorCharStart: number;
  errorLength?: number;
}


export interface StencilSystem {
  copy?(src: string, dest: string, opts?: {
    filter?: (src: string, dest?: string) => boolean;
  }): Promise<void>;
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
  };
  createDom?(): {
    parse(hydrateOptions: HydrateOptions): Window;
    serialize(): string;
    destroy(): void;
  };
  emptyDir?(dir: string): Promise<void>;
  ensureDir?(dir: string): Promise<void>;
  ensureDirSync?(dir: string): void;
  ensureFile?(dir: string): Promise<void>;
  fs?: {
    access(path: string, callback: (err: any) => void): void;
    accessSync(path: string, mode?: number): void
    mkdir(path: string, callback?: (err?: any) => void): void;
    readdir(path: string, callback?: (err: any, files: string[]) => void): void;
    readFile(filename: string, encoding: string, callback: (err: any, data: string) => void): void;
    readFileSync(filename: string, encoding: string): string;
    stat(path: string, callback?: (err: any, stats: { isFile(): boolean; isDirectory(): boolean; size: number; }) => any): void;
    statSync(path: string): { isFile(): boolean; isDirectory(): boolean; };
    unlink(path: string, callback?: (err?: any) => void): void;
    writeFile(filename: string, data: any, callback?: (err: any) => void): void;
    writeFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number; flag?: string; }): void;
  };
  generateContentHash?(content: string, length: number): string;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  glob?(pattern: string, options: {
    cwd?: string;
    nodir?: boolean;
  }): Promise<string[]>;
  isGlob?(str: string): boolean;
  loadConfigFile?(configPath: string): BuildConfig;
  minifyCss?(input: string, opts?: any): {
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
  };
  minifyJs?(input: string, opts?: any): {
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
  };
  minimatch?(path: string, pattern: string, opts?: any): boolean;
  resolveModule?(fromDir: string, moduleId: string): string;
  path?: {
    basename(p: string, ext?: string): string;
    dirname(p: string): string;
    extname(p: string): string;
    isAbsolute(p: string): boolean;
    join(...paths: string[]): string;
    relative(from: string, to: string): string;
    resolve(...pathSegments: any[]): string;
    sep: string;
  };
  remove?(path: string): Promise<void>;
  rollup?: {
    rollup: {
      (config: RollupInputConfig): Promise<RollupBundle>;
    };
    plugins: RollupPlugins;
  };
  sass?: {
    render(
      config: {
        data?: string;
        file?: string;
        includePaths?: string[];
        outFile?: string;
        outputStyle?: string;
      },
      cb: (err: any, result: {css: string; stats: any}) => void
    ): void;
  };
  semver?: {
    gt: (a: string, b: string, loose?: boolean) => boolean;
    gte: (a: string, b: string, loose?: boolean) => boolean;
    lt: (a: string, b: string, loose?: boolean) => boolean;
    lte: (a: string, b: string, loose?: boolean) => boolean;
  };
  typescript?: any;
  url?: {
    parse(urlStr: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): Url;
    format(url: Url): string;
    resolve(from: string, to: string): string;
  };
  vm?: {
    createContext(ctx: BuildContext, wwwDir: string, sandbox?: any): any;
    runInContext(code: string, contextifiedSandbox: any, options?: any): any;
  };
  watch?(paths: string | string[], opts?: any): FSWatcher;
  workbox?: Workbox;
}


export interface RollupInputConfig {
  entry?: any;
  input?: string;
  cache?: any;
  external?: Function;
  plugins?: any[];
  onwarn?: Function;
}

export interface RollupBundle {
  generate: {(config: RollupGenerateConfig): Promise<RollupGenerateResults>};
}


export interface RollupGenerateConfig {
  format: 'es' | 'cjs';
  intro?: string;
  outro?: string;
  banner?: string;
  footer?: string;
  exports?: string;
  external?: string[];
  globals?: {[key: string]: any};
  moduleName?: string;
  strict?: boolean;
}


export interface RollupGenerateResults {
  code: string;
  map: any;
}


export interface RollupPlugins {
  [pluginName: string]: any;
}


export interface PackageJsonData {
  name: string;
  version: string;
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
  port?: string;
  host?: string;
  pathname?: string;
  search?: string;
  query?: string | any;
  slashes?: boolean;
  hash?: string;
  path?: string;
}


export interface FSWatcher {
  on(eventName: string, callback: Function): this;
  add(path: string|string[]): this;
  $triggerEvent(eventName: string, path: string): void;
}


export interface HydrateResults {
  diagnostics: Diagnostic[];
  url?: string;
  host?: string;
  hostname?: string;
  port?: string;
  path?: string;
  pathname?: string;
  search?: string;
  query?: string;
  hash?: string;
  html?: string;
  styles?: string;
  anchors?: HydrateAnchor[];
  root?: HTMLElement;
  components?: HydrateComponent[];
  styleUrls?: string[];
  scriptUrls?: string[];
  imgUrls?: string[];
  opts?: HydrateOptions;
}


export interface HydrateComponent {
  tag: string;
  count?: number;
  depth?: number;
}


export interface HydrateAnchor {
  [attrName: string]: string;
}


export interface FilesMap {
  [filePath: string]: string;
}


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


declare global {
  // these must be "var" variables
  // so that they could be re-declared by
  // other collections, do not use "const" or "let"
  // "h" function is global so JSX doesn't throw typescript errors
  var h: Hyperscript;
}


// this maps the json data to our internal data structure
// so that the internal data structure "could" change,
// but the external user data will always use the same api
// consider these property values to be locked in as is
// there should be a VERY good reason to have to rename them
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!
// DO NOT UPDATE PROPERTY KEYS COMING FROM THE EXTERNAL DATA!!

export interface ManifestData {
  bundles?: BundleData[];
  components?: ComponentData[];
  global?: string;
  compiler?: {
    name: string;
    version: string;
    typescriptVersion?: string;
  };
}

export interface BundleData {
  components?: string[];
  priority?: 'low';
}

export interface ComponentData {
  tag?: string;
  componentPath?: string;
  componentClass?: string;
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
  slot?: 'hasSlots'|'hasNamedSlots';
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
  type?: 'Boolean'|'Number'|'String'|'Any';
  mutable?: boolean;
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

export interface ComponentWillLoad {
  componentWillLoad: () => Promise<void> | void;
}

export interface ComponentDidLoad {
  componentDidLoad: () => void;
}

export interface ComponentWillUpdate {
  componentWillUpdate: () => Promise<void> | void;
}

export interface ComponentDidUpdate {
  componentDidUpdate: () => void;
}

export interface ComponentDidUnload {
  componentDidUnload: () => void;
}

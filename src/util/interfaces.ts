import { CssClassMap } from './jsx-interfaces';
export { CssClassMap } from './jsx-interfaces';


export interface CoreGlobal {
  addListener?: AddEventListenerApi;
  dom?: DomControllerApi;
  emit?: (elm: Element, eventName: string, data?: EventEmitterData) => void;
  enableListener?: EventListenerEnable;
  eventNameFn?: (eventName: string) => string;
  isClient?: boolean;
  isServer?: boolean;
  mode?: string;
}


export interface AppGlobal {
  components?: LoadComponentRegistry[];
  defineComponents?: (moduleId: string, modulesImporterFn: ModulesImporterFn, cmp0?: LoadComponentMeta, cmp1?: LoadComponentMeta, cmp2?: LoadComponentMeta) => void;
}


export interface AddEventListenerApi {
  (elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: EventListenerCallback, opts?: ListenOptions): Function;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string): void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface EventEmitter {
  emit: (data?: any) => void;
}


export interface QueueApi {
  add: (cb: Function, priority?: number) => void;
  flush: (cb?: Function) => void;
}


export interface Now {
  (): number;
}


export interface DomControllerApi {
  read: DomControllerCallback;
  write: DomControllerCallback;
  raf: DomControllerCallback;
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
   * module id
   */
  [1]: string;

  /**
   * map of the mode styles and css bundle ids
   */
  [2]: {
    [modeName: string]: string
  };

  /**
   * slot
   */
  [3]: number;

  /**
   * props
   */
  [4]: ComponentPropertyData[];

  /**
   * listeners
   */
  [5]: ComponentListenersData[];

  /**
   * load priority
   */
  [6]: number;
}


export interface ComponentPropertyData {
  /**
   * prop name
   */
  [0]: string;

  /**
   * attrib case
   */
  [1]: number;

  /**
   * prop type
   */
  [2]: number;

  /**
   * is stateful
   */
  [3]: number;
}


export interface LoadComponentMeta {
  /**
   * tag name (ION-BADGE)
   */
  [0]: string;

  /**
   * host
   */
  [1]: any;

  /**
   * states
   */
  [2]: StateMeta[];

  /**
   * prop WILL change
   */
  [3]: PropChangeMeta[];

  /**
   * prop DID change
   */
  [4]: PropChangeMeta[];

  /**
   * component instance events
   */
  [5]: EventMeta[];

  /**
   * methods
   */
  [6]: MethodMeta[];

  /**
   * host element member name
   */
  [7]: string;

  /**
   * shadow
   */
  [8]: boolean;
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


export interface PropChangeMeta {
  /**
   * prop name
   */
  [0]?: string;

  /**
   * fn name
   */
  [1]?: string;
}


export interface Manifest {
  manifestName?: string;
  modulesFiles?: ModuleFile[];
  bundles?: Bundle[];
  global?: ModuleFile;
  dependentManifests?: Manifest[];
}


export interface ModuleFile {
  tsFilePath?: string;
  tsText?: string;
  dtsFilePath?: string;
  jsFilePath?: string;
  hasCmpClass?: boolean;
  cmpMeta?: ComponentMeta;
  includedSassFiles?: string[];
  isCollectionDependency?: boolean;
}


export interface AppRegistry {
  namespace: string;
  loader: string;
  core?: string;
  coreEs5?: string;
  global?: string;
  components: LoadComponentRegistry[];
}


export interface Bundle {
  components: string[];
  priority?: number;
}


export interface BuildConfig {
  _isValidated?: boolean;
  sys?: StencilSystem;
  logger?: Logger;
  rootDir?: string;
  logLevel?: 'error'|'warn'|'info'|'debug';
  exclude?: string[];
  namespace?: string;
  global?: string;
  src?: string;
  buildDir?: string;
  collectionDir?: string;
  indexHtmlSrc?: string;
  indexHtmlBuild?: string;
  publicPath?: string;
  generateCollection?: boolean;
  bundles?: Bundle[];
  collections?: DependentCollection[];
  devMode?: boolean;
  watch?: boolean;
  hashFileNames?: boolean;
  minifyCss?: boolean;
  minifyJs?: boolean;
  preamble?: string;
  hashedFileNameLength?: number;
  suppressTypeScriptErrors?: boolean;
  attrCase?: number;
  watchIgnoredRegex?: RegExp;
  prerenderIndex?: HydrateOptions;
}


export interface BuildResults {
  files: string[];
  diagnostics: Diagnostic[];
  manifest: ManifestData;
  changedFiles: string[];
}


export interface BuildContext {
  moduleFiles?: ModuleFiles;
  jsFiles?: FilesMap;
  cssFiles?: FilesMap;
  moduleBundleOutputs?: ModuleBundles;
  styleSassOutputs?: ModuleBundles;
  filesToWrite?: FilesMap;
  dependentManifests?: {[collectionName: string]: Manifest};
  appFiles?: {
    loader?: string;
    core?: string;
    coreEs5?: string;
    global?: string;
    registryJson?: string;
    indexHtml?: string;
  };
  watcher?: FSWatcher;
  tsConfig?: any;

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
  styleBundleCount?: number;

  diagnostics?: Diagnostic[];
  registry?: ComponentRegistry;
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


export interface TranspileResults {
  moduleFiles: ModuleFiles;
}


export interface ModuleResults {
  bundles: {
    [bundleId: string]: string;
  };
}


export interface StylesResults {
  bundles: {
    [bundleId: string]: {
      [modeName: string]: string;
    };
  };
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
}


export interface LoggerTimeSpan {
  finish(finishedMsg: string, color?: string, bold?: boolean, newLineSuffix?: boolean): void;
}


export interface ModulesImporterFn {
  (importer: any, h: Function, t: Function, Core: CoreGlobal, pubicPath: string): void;
}


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrl?: string;
  styleUrls?: string[] | ModeStyles;
  styles?: string;
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
  type?: string;
  state?: boolean;
}


export interface PropMeta {
  propName?: string;
  propType?: number;
  attribName?: string;
  attribCase?: number;
  isStateful?: boolean;
}


export type MethodMeta = string;


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
  eventName?: string;
  eventMethodName?: string;
  eventBubbles?: boolean;
  eventCancelable?: boolean;
  eventComposed?: boolean;
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
}


export interface StateDecorator {
  (): any;
}


export type StateMeta = string;


export interface PropChangeDecorator {
  (propName: string): any;
}


export interface PropChangeOpts {
  fn: string;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  moduleId?: string;
  styleIds?: {[modeName: string]: string };
  stylesMeta?: StylesMeta;
  methodsMeta?: MethodMeta[];
  propsMeta?: PropMeta[];
  eventsMeta?: EventMeta[];
  listenersMeta?: ListenMeta[];
  propsWillChangeMeta?: PropChangeMeta[];
  propsDidChangeMeta?: PropChangeMeta[];
  statesMeta?: StateMeta[];
  isShadowMeta?: boolean;
  hostMeta?: HostMeta;
  assetsDirsMeta?: AssetsMeta[];
  hostElementMember?: string;
  slotMeta?: number;
  loadPriority?: number;
  componentModule?: any;
  componentClass?: string;
}


export interface StylesMeta {
  [modeName: string]: StyleMeta;
}


export interface StyleMeta {
  styleId?: string;
  absolutePaths?: string[];
  cmpRelativePaths?: string[];
  styleStr?: string;
}


export interface AssetsMeta {
  absolutePath?: string;
  cmpRelativePath?: string;
}


export interface HostMeta {
  [key: string]: any;
}


export interface ComponentInstance {
  componentWillLoad?: () => void;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => void;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;

  render?: () => any;
  hostData?: () => VNodeData;

  mode?: string;
  color?: string;

  // private properties
  __values?: ComponentInternalValues;
  __el?: HostElement;

  [memberName: string]: any;
}


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export interface ComponentActivePropChanges {
  [propName: string]: Function;
}


export interface ComponentInternalValues {
  __propWillChange?: ComponentActivePropChanges;
  __propDidChange?: ComponentActivePropChanges;
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
  // registry tag must always be UPPER-CASE
  [registryTag: string]: ComponentMeta;
}


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;

  // public properties
  $instance?: ComponentInstance;
  mode?: string;
  color?: string;

  // private methods
  _render: (isUpdateRender?: boolean) => void;
  _initLoad: () => void;
  _queueUpdate: () => void;

  // private properties
  _activelyLoadingChildren?: HostElement[];
  _ancestorHostElement?: HostElement;
  _hasConnected?: boolean;
  _hasDestroyed?: boolean;
  _hasLoaded?: boolean;
  _hostContentNodes?: HostContentNodes;
  _isQueuedForUpdate?: boolean;
  _listeners?: ComponentActiveListeners;
  _queuedEvents?: any[];
  _root?: HTMLElement | ShadowRoot;
  _vnode: VNode;
}


export interface RendererApi {
  (oldVNode: VNode | Element, newVNode: VNode, isUpdate?: boolean, hostContentNodes?: HostContentNodes, ssrId?: number): VNode;
}


export interface DomApi {
  $documentElement: HTMLElement;
  $head: HTMLHeadElement;
  $body: HTMLElement;
  $nodeType(node: any): number;
  $createEvent(): CustomEvent;
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
}

export type Key = string | number;


export interface HostContentNodes {
  defaultSlot?: Node[];
  namedSlots?: {[slotName: string]: Node[]};
}


export interface VNode {
  // using v prefixes largely so closure has no issue property renaming
  vtag: string|number;
  vtext: string;
  vchildren: VNode[];
  vprops: any;
  vattrs: any;
  vclass: CssClassMap;
  vstyle: any;
  vlisteners: any;
  vkey: Key;
  elm: Element|Node;
  vnamespace: any;
  assignedListener: any;
  skipDataOnUpdate: boolean;
  skipChildrenOnUpdate: boolean;
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
  /**
   * props
   */
  p?: any;
  /**
   * attrs
   */
  a?: any;
  /**
   * css classes
   */
  c?: CssClassMap;
  /**
   * styles
   */
  s?: any;
  /**
   * on (event listeners)
   */
  o?: any;
  /**
   * key
   */
  k?: Key;
  /**
   * namespace
   */
  n?: any;
  /**
   * check once
   */
  x?: number;
}


export interface PlatformApi {
  registerComponents?: (components?: LoadComponentRegistry[]) => ComponentMeta[];
  defineComponent: (cmpMeta: ComponentMeta, HostElementConstructor?: any) => void;
  getComponentMeta: (elm: Element) => ComponentMeta;
  loadBundle: (cmpMeta: ComponentMeta, elm: HostElement, cb: Function) => void;
  render?: RendererApi;
  connectHostElement: (elm: HostElement, slotMeta: number) => void;
  queue: QueueApi;
  onAppLoad?: (rootElm: HostElement, stylesMap: FilesMap) => void;
  getEventOptions: (useCapture?: boolean, usePassive?: boolean) => any;
  emitEvent: (elm: Element, eventName: string, data: EventEmitterData) => void;
  tmpDisconnected?: boolean;
  onError: (type: number, err: any, elm: HostElement) => void;
}


export interface EventEmitterData {
  detail?: any;
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


export interface ModuleCallbacks {
  [moduleId: string]: Function[];
}


export interface Diagnostic {
  level: 'error'|'warn'|'info';
  type: string;
  header: string;
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
  copyDir?(src: string, dest: string, callback: (err: any) => void): void;
  createDom?(): {
    parse(hydrateOptions: HydrateOptions): Window;
    serialize(): string;
    destroy(): void;
    getDiagnostics(): Diagnostic[];
  };
  fs?: {
    access(path: string, callback: (err: any) => void): void;
    accessSync(path: string | Buffer, mode?: number): void
    mkdir(path: string, callback?: (err?: any) => void): void;
    readdir(path: string, callback?: (err: any, files: string[]) => void): void;
    readFile(filename: string, encoding: string, callback: (err: any, data: string) => void): void;
    readFileSync(filename: string, encoding: string): string;
    stat(path: string, callback?: (err: any, stats: { isFile(): boolean; isDirectory(): boolean; }) => any): void;
    unlink(path: string, callback?: (err?: any) => void): void;
    writeFile(filename: string, data: any, callback?: (err: any) => void): void;
    writeFileSync(filename: string, data: any, options?: { encoding?: string; mode?: number; flag?: string; }): void;
  };
  generateContentHash?(content: string, length: number): string;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  minifyCss?(input: string): {
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
  };
  minifyJs?(input: string): {
    output: string;
    sourceMap?: any;
    diagnostics?: Diagnostic[];
  };
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
  rmDir?(path: string, callback: (err: any) => void): void;
  rollup?: {
    rollup: {
      (config: { entry: string; plugins?: any[]; treeshake?: boolean; onwarn?: Function; }): Promise<{
        generate: {(config: {
          format?: string;
          banner?: string;
          footer?: string;
          exports?: string;
          external?: string[];
          globals?: {[key: string]: any};
          moduleName?: string;
          plugins?: any;
        }): {
          code: string;
          map: any;
        }}
      }>;
    };
    plugins: { [pluginName: string]: any };
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
  typescript?: any;
  vm?: {
    createContext(sandbox?: any): any;
    runInContext(code: string, contextifiedSandbox: any, options?: any): any;
  };
  watch?(paths: string | string[], opts?: any): FSWatcher;
}


export interface FSWatcher {
  on(eventName: string, callback: Function): this;
  $triggerEvent(eventName: string, path: string): void;
}


export interface HydrateOptions {
  req?: {
    protocol: string;
    get: (key: string) => string;
    originalUrl: string;
    url: string;
  };
  html?: string;
  url?: string;
  referrer?: string;
  userAgent?: string;
  cookie?: string;
  dir?: string;
  lang?: string;
  removeUnusedCss?: boolean;
  reduceHtmlWhitepace?: boolean;
  inlineLoaderScript?: boolean;
}


export interface HydrateResults {
  diagnostics: Diagnostic[];
  html?: string;
  styles?: string;
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
  var Core: CoreGlobal;
  var publicPath: string;
  var appNamespace: string;
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
  propsWillChange?: PropChangeData[];
  propsDidChange?: PropChangeData[];
  states?: string[];
  listeners?: ListenerData[];
  methods?: string[];
  events?: EventData[];
  hostElement?: string;
  host?: any;
  assetPaths?: string[];
  slot?: 'hasSlots'|'hasNamedSlots';
  shadow?: boolean;
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
  type?: 'boolean'|'number';
  stateful?: boolean;
}

export interface PropChangeData {
  name: string;
  method: string;
}

export interface ListenerData {
  event: string;
  method: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}

export interface EventData {
  event: string;
  method?: string;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

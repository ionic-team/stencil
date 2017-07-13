import * as jsxInterface from './jsx-interfaces';
import { CssClassObject } from './jsx-interfaces';
export { CssClassObject } from './jsx-interfaces';

export interface Ionic {
  emit: EventEmit;
  listener: {
    enable: EventListenerEnable;
    add: AddEventListenerApi;
  };
  theme: IonicTheme;
  controller?: IonicController;
  dom: DomControllerApi;
  config: ConfigApi;
  Animation?: Animation;
  isServer: boolean;
  isClient: boolean;
}


export interface IonicController {
  <LoadingController>(ctrlName: 'loading', opts: LoadingOptions): Promise<Loading>;
  <MenuController>(ctrlName: 'menu'): Promise<MenuController>;
  <ModalController>(ctrlName: 'modal', opts: ModalOptions): Promise<Modal>;
  (ctrlName: string, opts?: any): Promise<IonicControllerApi>;
}


export interface IonicControllerApi {
  load?: (opts?: any) => Promise<any>;
}


export interface ProjectNamespace {
  components?: LoadComponentRegistry[];
  defineComponents?: (moduleId: string, modulesImporterFn: ModulesImporterFn, cmp0?: LoadComponentMeta, cmp1?: LoadComponentMeta, cmp2?: LoadComponentMeta) => void;
  eventNameFn?: (eventName: string) => string;
  config?: Object;
  loadController?: (ctrlName: string, ctrl: any) => any;
  controllers?: {[ctrlName: string]: any};
  ConfigCtrl?: ConfigApi;
  DomCtrl?: DomControllerApi;
  QueueCtrl?: QueueApi;
  Animation?: any;
}


export interface Menu {
  setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
  open(): Promise<boolean>;
  close(): Promise<boolean>;
  toggle(): Promise<boolean>;
  enable(shouldEnable: boolean): Menu;
  swipeEnable(shouldEnable: boolean): Menu;
  isAnimating: boolean;
  isOpen: boolean;
  isRightSide: boolean;
  enabled: boolean;
  side: string;
  id: string;
  maxEdgeStart: number;
  persistent: boolean;
  swipeEnabled: boolean;
  type: string;
  width(): number;
  getMenuElement(): HTMLElement;
  getContentElement(): HTMLElement;
  getBackdropElement(): HTMLElement;
}


export interface MenuType {
  ani: any;
  isOpening: boolean;
  setOpen(shouldOpen: boolean, animated: boolean, done: Function): void;
  setProgressStart(isOpen: boolean): void;
  setProgessStep(stepValue: number): void;
  setProgressEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function): void;
  destroy(): void;
}


export interface MenuController {
  open(menuId?: string): Promise<boolean>;
  close(menuId?: string): Promise<boolean>;
  toggle(menuId?: string): Promise<boolean>;
  enable(shouldEnable: boolean, menuId?: string): void;
  swipeEnable(shouldEnable: boolean, menuId?: string): void;
  isOpen(menuId?: string): boolean;
  isEnabled(menuId?: string): boolean;
  get(menuId?: string): Menu;
  getOpen(): Menu;
  getMenus(): Menu[];
}


export interface Modal {
  component: string;
  componentProps?: any;
  id: string;
  style?: {
    zIndex: number;
  };
  showBackdrop: boolean;
  enableBackdropDismiss: boolean;
  enterAnimation: AnimationBuilder;
  exitAnimation: AnimationBuilder;
  cssClass: string;
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
}


export interface ModalOptions {
  component: string;
  componentProps?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
}


export interface ModalEvent {
  detail: {
    modal: Modal;
  };
}


export interface Loading {
  id: string;
  style?: {
    zIndex: number;
  };
  showBackdrop: boolean;
  enterAnimation: AnimationBuilder;
  exitAnimation: AnimationBuilder;
  cssClass: string;
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
}


export interface LoadingOptions {
  spinner?: string;
  content?: string;
  cssClass?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
  duration?: number;
}


export interface LoadingEvent {
  detail: {
    loading: Loading;
  };
}


export interface AddEventListenerApi {
  (elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: (ev?: any) => void, opts?: ListenOptions): Function;
}


export interface EventEmit {
  (instance: any, eventName: string, data?: CustomEventOptions): void;
}


export interface CustomEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string): void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface GestureDetail {
  type?: string;
  event?: UIEvent;
  startX?: number;
  startY?: number;
  startTimeStamp?: number;
  currentX?: number;
  currentY?: number;
  velocityX?: number;
  velocityY?: number;
  deltaX?: number;
  deltaY?: number;
  directionX?: 'left'|'right';
  directionY?: 'up'|'down';
  velocityDirectionX?: 'left'|'right';
  velocityDirectionY?: 'up'|'down';
  timeStamp?: number;
}


export interface GestureCallback {
  (detail?: GestureDetail): boolean|void;
}


export interface ScrollDetail extends GestureDetail {
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  contentHeight?: number;
  contentWidth?: number;
  contentTop?: number;
  contentBottom?: number;
  domWrite?: DomControllerCallback;
  contentElement?: HTMLElement;
  fixedElement?: HTMLElement;
  scrollElement?: HTMLElement;
  headerElement?: HTMLElement;
  footerElement?: HTMLElement;
}


export interface ScrollCallback {
  (detail?: ScrollDetail): boolean|void;
}


export interface ContentDimensions {
  contentHeight: number;
  contentTop: number;
  contentBottom: number;

  contentWidth: number;
  contentLeft: number;

  scrollHeight: number;
  scrollTop: number;

  scrollWidth: number;
  scrollLeft: number;
}


export interface QueueApi {
  add: (cb: Function, priority?: number) => void;
  flush: (cb?: Function) => void;
}


export interface DomControllerApi {
  read: DomControllerCallback;
  write: DomControllerCallback;
  raf: DomControllerCallback;
  now(): number;
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
  [4]: {
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
  }[];

  /**
   * load priority
   */
  [5]: number;
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
   * listeners
   */
  [2]: ComponentListenersData[];

  /**
   * states
   */
  [3]: StateMeta[];

  /**
   * prop WILL change
   */
  [4]: PropChangeMeta[];

  /**
   * prop DID change
   */
  [5]: PropChangeMeta[];

  /**
   * methods
   */
  [6]: MethodMeta[];

  /**
   * shadow
   */
  [7]: boolean;
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
  components?: ComponentMeta[];
  bundles?: Bundle[];
}


export interface ProjectRegistry {
  namespace: string;
  loader: string;
  core?: string;
  coreEs5?: string;
  components: LoadComponentRegistry[];
}


export interface Bundle {
  components: string[];
  priority?: number;
}


export interface BuildConfig {
  sys?: StencilSystem;
  logger?: Logger;
  rootDir?: string;
  logLevel?: 'error'|'warn'|'info'|'debug';
  exclude?: string[];
  namespace?: string;
  src?: string;
  buildDest?: string;
  collectionDest?: string;
  indexSrc?: string;
  indexDest?: string;
  staticBuildDir?: string;
  generateCollection?: boolean;
  bundles?: Bundle[];
  collections?: Collection[];
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
  inlineAppLoader?: boolean;
}


export interface Collection {
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
  (importer: any, h: Function, t: Function, Ionic: Ionic): void;
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
  eventEnabled?: boolean;
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


export interface IonicTheme {
  (instance: any, cssClassName: string, vnodeData?: VNodeData): VNodeData;
}


export interface ConfigApi {
  get: (key: string, fallback?: any) => any;
  getBoolean: (key: string, fallback?: boolean) => boolean;
  getNumber: (key: string, fallback?: number) => number;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  moduleId?: string;
  styleIds?: {[modeName: string]: string };
  stylesMeta?: StylesMeta;
  methodsMeta?: MethodMeta[];
  propsMeta?: PropMeta[];
  listenersMeta?: ListenMeta[];
  propWillChangeMeta?: PropChangeMeta[];
  propDidChangeMeta?: PropChangeMeta[];
  statesMeta?: StateMeta[];
  isShadowMeta?: boolean;
  hostMeta?: HostMeta;
  assetsDirsMeta?: string[];
  slotMeta?: number;
  loadPriority?: number;
  componentModuleMeta?: any;
  componentClass?: string;
  componentPath?: string;
}


export interface StylesMeta {
  [modeName: string]: StyleMeta;
}


export interface StyleMeta {
  styleId?: string;
  absStylePaths?: string[];
  cmpRelativeStylePaths?: string[];
  styleStr?: string;
}


export interface HostMeta {
  [key: string]: any;
}


export interface Component {
  componentWillLoad?: () => void;
  componentDidLoad?: () => void;
  componentWillUpdate?: () => void;
  componentDidUpdate?: () => void;
  componentDidUnload?: () => void;

  render?: () => any;
  hostData?: () => VNodeData;

  mode?: string;
  color?: string;

  // public properties
  $el?: HostElement;

  // private properties
  __values?: ComponentInternalValues;

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


export interface BaseInputComponent extends Component {
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
  new (): Component;
}


export interface ComponentRegistry {
  [tag: string]: ComponentMeta;
}


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;

  // public properties
  $instance?: Component;

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
  vclass: CssClassObject;
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
  class?: CssClassObject;
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
  c?: CssClassObject;
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
  config: ConfigApi;
  connectHostElement: (elm: HostElement, slotMeta: number) => void;
  queue: QueueApi;
  isServer?: boolean;
  onAppLoad?: (rootElm: HostElement, styles: string) => void;
  getEventOptions: (opts?: ListenOptions) => any;
  tmpDisconnected?: boolean;
}


export interface PlatformConfig {
  name: string;
  isMatch?: {(url: string, userAgent: string): boolean};
  settings?: any;
}


export interface Animation {
  new(elm?: Node|Node[]|NodeList): Animation;
  add: (childAnimation: Animation) => Animation;
  addElement: (elm: Node|Node[]|NodeList) => Animation;
  afterAddClass: (className: string) => Animation;
  afterClearStyles: (propertyNames: string[]) => Animation;
  afterRemoveClass: (className: string) => Animation;
  afterStyles: (styles: { [property: string]: any; }) => Animation;
  beforeAddClass: (className: string) => Animation;
  beforeClearStyles: (propertyNames: string[]) => Animation;
  beforeRemoveClass: (className: string) => Animation;
  beforeStyles: (styles: { [property: string]: any; }) => Animation;
  destroy: () => void;
  duration: (milliseconds: number) => Animation;
  getDuration(opts?: PlayOptions): number;
  easing: (name: string) => Animation;
  easingReverse: (name: string) => Animation;
  from: (prop: string, val: any) => Animation;
  fromTo: (prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean) => Animation;
  hasCompleted: boolean;
  isPlaying: boolean;
  onFinish: (callback: (animation: Animation) => void, opts?: {oneTimeCallback?: boolean, clearExistingCallacks?: boolean}) => Animation;
  play: (opts?: PlayOptions) => void;
  syncPlay: () => void;
  progressEnd: (shouldComplete: boolean, currentStepValue: number, dur: number) => void;
  progressStep: (stepValue: number) => void;
  progressStart: () => void;
  reverse: (shouldReverse?: boolean) => Animation;
  stop: (stepValue?: number) => void;
  to: (prop: string, val: any, clearProperyAfterTransition?: boolean) => Animation;
}


export interface AnimationBuilder {
  (elm?: HTMLElement): Animation;
}


export interface AnimationOptions {
  animation?: string;
  duration?: number;
  easing?: string;
  direction?: string;
  isRTL?: boolean;
  ev?: any;
}


export interface PlayOptions {
  duration?: number;
  promise?: boolean;
}


export interface EffectProperty {
  effectName: string;
  trans: boolean;
  wc?: string;
  to?: EffectState;
  from?: EffectState;
  [state: string]: any;
}


export interface EffectState {
  val: any;
  num: number;
  effectUnit: string;
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
  level: 'error'|'warn';
  type: 'runtime'|'build'|'typescript'|'sass';
  header: string;
  messageText: string;
  language?: 'javascript'|'typescript'|'scss';
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lines?: PrintLine[];
}


export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text: string;
  html: string;
  errorCharStart: number;
  errorLength: number;
}


export interface StencilSystem {
  copyDir?(src: string, dest: string, callback: (err: any) => void): void;
  createDom?(): {
    parse(hydrateOptions: HydrateOptions): Window;
    serialize(): string;
  };
  fs?: {
    access(path: string, callback: (err: any) => void): void;
    mkdir(path: string, callback?: (err?: any) => void): void;
    readdir(path: string, callback?: (err: any, files: string[]) => void): void;
    readFile(filename: string, encoding: string, callback: (err: any, data: string) => void): void;
    readFileSync(filename: string, encoding: string): string;
    stat(path: string, callback?: (err: any, stats: { isFile(): boolean; isDirectory(): boolean; }) => any): void;
    unlink(path: string, callback?: (err?: any) => void): void;
    writeFile(filename: string, data: any, callback?: (err: any) => void): void;
  };
  generateContentHash?(content: string, length: number): string;
  getClientCoreFile?(opts: {staticName: string}): Promise<string>;
  htmlParser?: {
    parse(html: string): any;
    serialize(node: any): string;
    getElementsByTagName(node: any, tag: string): any[];
    getAttribute(node: any, key: string): string;
    removeNode(node: any): void;
    appendChild(parentNode: any, childNode: any): void;
    createElement(tag: string): any;
    createText(content: string): any;
  };
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


export interface RendererOptions {
  registry?: ComponentRegistry;
  staticDir?: string;
  debug?: boolean;
  sys?: StencilSystem;
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
  config?: Object;
  removeUnusedCss?: boolean;
  reduceHtmlWhitepace?: boolean;
  staticBuildDir?: string;
}

declare global {
  namespace JSX {
    interface Element {
    }
    interface IntrinsicElements {
      // Stencil elements
      slot: jsxInterface.SlotAttributes;

      // HTML
      a: jsxInterface.AnchorHTMLAttributes;
      abbr: jsxInterface.HTMLAttributes;
      address: jsxInterface.HTMLAttributes;
      area: jsxInterface.AreaHTMLAttributes;
      article: jsxInterface.HTMLAttributes;
      aside: jsxInterface.HTMLAttributes;
      audio: jsxInterface.AudioHTMLAttributes;
      b: jsxInterface.HTMLAttributes;
      base: jsxInterface.BaseHTMLAttributes;
      bdi: jsxInterface.HTMLAttributes;
      bdo: jsxInterface.HTMLAttributes;
      big: jsxInterface.HTMLAttributes;
      blockquote: jsxInterface.BlockquoteHTMLAttributes;
      body: jsxInterface.HTMLAttributes;
      br: jsxInterface.HTMLAttributes;
      button: jsxInterface.ButtonHTMLAttributes;
      canvas: jsxInterface.CanvasHTMLAttributes;
      caption: jsxInterface.HTMLAttributes;
      cite: jsxInterface.HTMLAttributes;
      code: jsxInterface.HTMLAttributes;
      col: jsxInterface.ColHTMLAttributes;
      colgroup: jsxInterface.ColgroupHTMLAttributes;
      data: jsxInterface.HTMLAttributes;
      datalist: jsxInterface.HTMLAttributes;
      dd: jsxInterface.HTMLAttributes;
      del: jsxInterface.DelHTMLAttributes;
      details: jsxInterface.DetailsHTMLAttributes;
      dfn: jsxInterface.HTMLAttributes;
      dialog: jsxInterface.HTMLAttributes;
      div: jsxInterface.HTMLAttributes;
      dl: jsxInterface.HTMLAttributes;
      dt: jsxInterface.HTMLAttributes;
      em: jsxInterface.HTMLAttributes;
      embed: jsxInterface.EmbedHTMLAttributes;
      fieldset: jsxInterface.FieldsetHTMLAttributes;
      figcaption: jsxInterface.HTMLAttributes;
      figure: jsxInterface.HTMLAttributes;
      footer: jsxInterface.HTMLAttributes;
      form: jsxInterface.FormHTMLAttributes;
      h1: jsxInterface.HTMLAttributes;
      h2: jsxInterface.HTMLAttributes;
      h3: jsxInterface.HTMLAttributes;
      h4: jsxInterface.HTMLAttributes;
      h5: jsxInterface.HTMLAttributes;
      h6: jsxInterface.HTMLAttributes;
      head: jsxInterface.HTMLAttributes;
      header: jsxInterface.HTMLAttributes;
      hgroup: jsxInterface.HTMLAttributes;
      hr: jsxInterface.HTMLAttributes;
      html: jsxInterface.HTMLAttributes;
      i: jsxInterface.HTMLAttributes;
      iframe: jsxInterface.IframeHTMLAttributes;
      img: jsxInterface.ImgHTMLAttributes;
      input: jsxInterface.InputHTMLAttributes;
      ins: jsxInterface.InsHTMLAttributes;
      kbd: jsxInterface.HTMLAttributes;
      keygen: jsxInterface.KeygenHTMLAttributes;
      label: jsxInterface.LabelHTMLAttributes;
      legend: jsxInterface.HTMLAttributes;
      li: jsxInterface.LiHTMLAttributes;
      link: jsxInterface.LinkHTMLAttributes;
      main: jsxInterface.HTMLAttributes;
      map: jsxInterface.MapHTMLAttributes;
      mark: jsxInterface.HTMLAttributes;
      menu: jsxInterface.MenuHTMLAttributes;
      menuitem: jsxInterface.HTMLAttributes;
      meta: jsxInterface.MetaHTMLAttributes;
      meter: jsxInterface.MeterHTMLAttributes;
      nav: jsxInterface.HTMLAttributes;
      noscript: jsxInterface.HTMLAttributes;
      object: jsxInterface.ObjectHTMLAttributes;
      ol: jsxInterface.OlHTMLAttributes;
      optgroup: jsxInterface.OptgroupHTMLAttributes;
      option: jsxInterface.OptionHTMLAttributes;
      output: jsxInterface.OutputHTMLAttributes;
      p: jsxInterface.HTMLAttributes;
      param: jsxInterface.ParamHTMLAttributes;
      picture: jsxInterface.HTMLAttributes;
      pre: jsxInterface.HTMLAttributes;
      progress: jsxInterface.ProgressHTMLAttributes;
      q: jsxInterface.QuoteHTMLAttributes;
      rp: jsxInterface.HTMLAttributes;
      rt: jsxInterface.HTMLAttributes;
      ruby: jsxInterface.HTMLAttributes;
      s: jsxInterface.HTMLAttributes;
      samp: jsxInterface.HTMLAttributes;
      script: jsxInterface.ScriptHTMLAttributes;
      section: jsxInterface.HTMLAttributes;
      select: jsxInterface.SelectHTMLAttributes;
      small: jsxInterface.HTMLAttributes;
      source: jsxInterface.SourceHTMLAttributes;
      span: jsxInterface.HTMLAttributes;
      strong: jsxInterface.HTMLAttributes;
      style: jsxInterface.StyleHTMLAttributes;
      sub: jsxInterface.HTMLAttributes;
      summary: jsxInterface.HTMLAttributes;
      sup: jsxInterface.HTMLAttributes;
      table: jsxInterface.TableHTMLAttributes;
      tbody: jsxInterface.HTMLAttributes;
      td: jsxInterface.TdHTMLAttributes;
      textarea: jsxInterface.TextareaHTMLAttributes;
      tfoot: jsxInterface.HTMLAttributes;
      th: jsxInterface.ThHTMLAttributes;
      thead: jsxInterface.HTMLAttributes;
      time: jsxInterface.TimeHTMLAttributes;
      title: jsxInterface.HTMLAttributes;
      tr: jsxInterface.HTMLAttributes;
      track: jsxInterface.TrackHTMLAttributes;
      u: jsxInterface.HTMLAttributes;
      ul: jsxInterface.HTMLAttributes;
      'var': jsxInterface.HTMLAttributes;
      video: jsxInterface.VideoHTMLAttributes;
      wbr: jsxInterface.HTMLAttributes;
      [elemName: string]: any;
    }
  }
}


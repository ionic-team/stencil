
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
  vdomRef: boolean;
  vdomPropOrAttr: boolean;
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

export interface Build extends Partial<BuildFeatures> {
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

export interface UserBuildConditionals {
  readonly isDev: boolean;
  readonly isBrowser: boolean;
}

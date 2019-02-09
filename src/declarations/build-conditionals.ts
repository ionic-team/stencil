
export interface BuildFeatures {
  // encapsulation
  style?: boolean;
  mode?: boolean;

  // dom
  shadowDom?: boolean;
  scoped?: boolean;

  // render
  /**
   * Every component has a render function
   */
  allRenderFn?: boolean;
  /**
   * At least one component has a render function
   */
  hasRenderFn?: boolean;
  /**
   * No components have a render function
   */
  noRenderFn?: boolean;

  // vdom
  vdomRender?: boolean;
  noVdomRender?: boolean;
  vdomAttribute?: boolean;
  vdomClass?: boolean;
  vdomStyle?: boolean;
  vdomKey?: boolean;
  vdomRef?: boolean;
  vdomListener?: boolean;
  vdomFunctional?: boolean;
  vdomText?: boolean;

  // elements
  slot?: boolean;
  svg?: boolean;

  // decorators
  element?: boolean;
  event?: boolean;
  hostListener?: boolean;
  hostListenerTargetWindow?: boolean;
  hostListenerTargetDocument?: boolean;
  hostListenerTargetBody?: boolean;
  hostListenerTargetParent?: boolean;
  hostListenerTarget?: boolean;
  method?: boolean;
  prop?: boolean;
  propMutable?: boolean;
  state?: boolean;
  watchCallback?: boolean;
  member?: boolean;
  updatable?: boolean;

  // lifecycle events
  asyncLifecycle?: boolean;
  lifecycle?: boolean;
  cmpDidLoad?: boolean;
  cmpWillLoad?: boolean;
  cmpDidUpdate?: boolean;
  cmpWillUpdate?: boolean;
  cmpWillRender?: boolean;
  cmpDidRender?: boolean;
  cmpDidUnload?: boolean;
  connectedCallback?: boolean;
  disconnectedCallback?: boolean;

  // attr
  observeAttribute?: boolean;
  reflect?: boolean;

  taskQueue?: boolean;
}

export interface Build extends BuildFeatures {
  clientSide?: boolean;
  devInspector?: boolean;
  es5?: boolean;
  externalModuleLoader?: boolean;
  hotModuleReplacement?: boolean;
  isDebug?: boolean;
  isDev?: boolean;
  isProd?: boolean;
  lifecycleDOMEvents?: boolean;
  lazyLoad?: boolean;
  prerenderServerSide?: boolean;
  prerenderClientSide?: boolean;
  polyfills?: boolean;
  profile?: boolean;
  slotRelocation?: boolean;
  syncQueue?: boolean;
}

export interface UserBuildConditionals {
  isDev?: boolean;
}

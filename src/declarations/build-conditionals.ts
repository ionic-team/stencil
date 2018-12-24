import * as d from '.';


export interface BuildFeatures {
  appModuleFiles: d.Module[];

  // encapsulation
  style: boolean;
  mode: boolean;

  // dom
  shadowDom: boolean;
  scoped: boolean;

  // render
  render: boolean;
  noRender: boolean;
  hostData: boolean;

  // vdom
  vdomRender: boolean;
  noVdomRender: boolean;
  vdomAttribute: boolean;
  vdomClass: boolean;
  vdomStyle: boolean;
  vdomKey: boolean;
  vdomRef: boolean;
  vdomListener: boolean;
  vdomFunctional: boolean;
  vdomText: boolean;

  // elements
  slot: boolean;
  svg: boolean;

  // decorators
  element: boolean;
  event: boolean;
  listener: boolean;
  method: boolean;
  prop: boolean;
  propMutable: boolean;
  state: boolean;
  watchCallback: boolean;
  member: boolean;
  updatable: boolean;

  // lifecycle events
  asyncLifecycle: boolean;
  lifecycle: boolean;
  cmpDidLoad: boolean;
  cmpWillLoad: boolean;
  cmpDidUpdate: boolean;
  cmpWillUpdate: boolean;
  cmpDidUnload: boolean;
  connectedCallback: boolean;
  disconnectedCallback: boolean;

  // attr
  observeAttr: boolean;
  reflectToAttr: boolean;
}

export interface Build extends BuildFeatures {
  appNamespace: string;
  appNamespaceLower: string;
  clientSide: boolean;
  devInspector: boolean;
  es5: boolean;
  exposeEventListener: boolean;
  exposeRequestAnimationFrame: boolean;
  exposeTaskQueue: boolean;
  externalModuleLoader: boolean;
  hotModuleReplacement: boolean;
  isDev: boolean;
  isProd: boolean;
  lazyLoad: boolean;
  prerenderServerSide: boolean;
  prerenderClientSide: boolean;
  polyfills: boolean;
  profile: boolean;
  slotPolyfill: boolean;
  syncQueue: boolean;
  taskQueue: boolean;
  updatable: boolean;
}

declare global {
  var BUILD: Build;
}

export interface UserBuildConditionals {
  isDev: boolean;
}

declare global {
  /** OLD WAY */
  var _BUILD_: any;
}

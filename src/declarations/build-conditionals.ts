

export type BuildCoreIds = 'core' | 'core.pf' | 'esm.es5' | 'esm.es2017';

export interface BuildConditionals {
  [key: string]: any;
  coreId: BuildCoreIds;
  polyfills: boolean;
  es5: boolean;
  cssVarShim: boolean;
  clientSide: boolean;
  browserModuleLoader: boolean;
  externalModuleLoader: boolean;

  // dev
  isDev: boolean;
  isProd: boolean;
  devInspector: boolean;
  hotModuleReplacement: boolean;
  verboseError: boolean;
  profile: boolean;

  // ssr
  ssrServerSide: boolean;
  prerenderClientSide: boolean;

  // encapsulation
  styles: boolean;

  // dom
  shadowDom: boolean;
  scoped: boolean;
  slotPolyfill: boolean;

  // vdom
  hostData: boolean;
  hostTheme: boolean;
  reflectToAttr: boolean;

  // decorators
  element: boolean;
  event: boolean;
  listener: boolean;
  method: boolean;
  propConnect: boolean;
  propContext: boolean;
  prop: boolean;
  propMutable: boolean;
  state: boolean;
  watchCallback: boolean;
  hasMembers: boolean;

  // lifecycle events
  cmpDidLoad: boolean;
  cmpWillLoad: boolean;
  cmpDidUpdate: boolean;
  cmpWillUpdate: boolean;
  cmpDidUnload: boolean;

  // attr
  observeAttr: boolean;

  // elements
  hasSlot: boolean;
  hasSvg: boolean;
}

declare global {
  var _BUILD_: BuildConditionals;
}

export interface UserBuildConditionals {
  isDev: boolean;
}

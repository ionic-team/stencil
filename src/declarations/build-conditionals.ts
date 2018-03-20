

export interface BuildConditionals {
  coreId?: 'core' | 'core.pf';
  polyfills?: boolean;
  es5?: boolean;
  cssVarShim?: boolean;
  clientSide?: boolean;

  // dev
  isDev: boolean;
  isProd: boolean;
  devInspector: boolean;
  verboseError: boolean;

  // ssr
  ssrServerSide: boolean;

  // encapsulation
  styles: boolean;

  // dom
  shadowDom: boolean;

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

export interface UserBuildConditionals {
  isDev: boolean;
}



export interface BuildConditionals {
  [key: string]: any;
  coreId: 'core' | 'core.pf' | 'esm.es5';
  polyfills: boolean;
  es5: boolean;
  cssVarShim: boolean;
  clientSide: boolean;
  browserModuleLoader: boolean;
  externalModuleLoader: boolean;

  /**
   * If this build should be able to hydrate the client
   * from the server side rendered html data.
   */
  hydrateClientFromSsr?: boolean;

  // dev
  isDev: boolean;
  isProd: boolean;
  devInspector: boolean;
  hotModuleReplacement: boolean;
  verboseError: boolean;

  /**
   * If this is a server side build
   */
  ssrServerSide: boolean;

  /**
   * If there is at least one component that has styles.
   */
  styles: boolean;

  /**
   * If there is at least one component that uses shadow dom.
   */
  hasShadowDom: boolean;
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
  watchCallback: boolean;

  // lifecycle events
  cmpDidLoad: boolean;
  cmpWillLoad: boolean;
  cmpDidUpdate: boolean;
  cmpWillUpdate: boolean;
  cmpDidUnload: boolean;

  // attr
  observeAttr: boolean;

  /**
   * If there is at least one component that has a <slot>
   */
  hasSlot: boolean;

  /**
   * If there is at least one component that has a <svg>
   */
  hasSvg: boolean;
}

declare global {
  /**
   * Build Conditionals allow each user's build to only
   * include features which the app is actually using. Everyone's
   * build will be slightly different. At build time, the
   * compiler will set each of the boolean values with the
   * __BUILD_CONDITIONALS__ object depending on what the
   * static analysis found.
   */
  var __BUILD_CONDITIONALS__: BuildConditionals;
}

export interface UserBuildConditionals {
  isDev: boolean;
}

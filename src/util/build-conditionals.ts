import { BuildConditionals } from '../declarations';


export const Build: BuildConditionals = {
  cssVarShim: true,
  shadowDom: true,
  slotPolyfill: true,
  ssrServerSide: true,

  devInspector: true,
  hotModuleReplacement: true,
  verboseError: true,

  styles: true,

  hostData: true,
  hostTheme: true,
  reflectToAttr: true,
  hasSlot: true,
  hasSvg: true,
  observeAttr: true,
  isDev: true,
  isProd: false,

  // decorators
  element: true,
  event: true,
  listener: true,
  method: true,
  propConnect: true,
  propContext: true,
  watchCallback: true,

  // lifecycle events
  cmpDidLoad: true,
  cmpWillLoad: true,
  cmpDidUpdate: true,
  cmpWillUpdate: true,
  cmpDidUnload: true,
};

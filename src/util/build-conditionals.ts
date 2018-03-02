import { BuildConditionals } from './interfaces';


export const Build: BuildConditionals = {
  cssVarShim: true,
  shadowDom: true,
  ssrServerSide: true,

  isDev: true,
  devInspector: true,
  verboseError: true,

  styles: true,

  hostData: true,
  hostTheme: true,
  svg: true,
  observeAttr: true,

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

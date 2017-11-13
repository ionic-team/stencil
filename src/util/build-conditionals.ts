import { BuildConditionals } from './interfaces';


export const Build: BuildConditionals = {
  verboseError: true,
  customSlot: true,

  ssrServerSide: true,

  styles: true,
  scopedCss: true,
  shadowDom: true,

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
  propDidChange: true,
  propWillChange: true,

  // lifecycle events
  cmpDidLoad: true,
  cmpWillLoad: true,
  cmpDidUpdate: true,
  cmpWillUpdate: true,
  cmpDidUnload: true,
};

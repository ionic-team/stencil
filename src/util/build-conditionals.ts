import { BuildConditionals } from './interfaces';


export const Build: BuildConditionals = {
  verboseError: true,

  shadowDom: true,
  slot: true,
  ssrClientSide: true,
  ssrServerSide: true,

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
  didChange: true,
  willChange: true,

  // lifecycle events
  cmpDidLoad: true,
  cmpWillLoad: true,
  cmpDidUpdate: true,
  cmpWillUpdate: true,
  cmpDidUnload: true,
};

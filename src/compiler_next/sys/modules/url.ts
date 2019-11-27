import { IS_NODE_ENV, requireFunc } from '../environment';


export const URL = (gbl => {
  if (IS_NODE_ENV) {
    gbl.URL = requireFunc('url').URL;
  }
  return gbl.URL;
})(globalThis) as any;

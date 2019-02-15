import * as d from '@declarations';
import { catchError } from '@utils';
import { getComponent } from './component-registry';


export function hydrateComponent(opts: d.HydrateOptions, results: d.HydrateResults, tagName: string, elm: d.HostElement) {
  const Cstr = getComponent(tagName);

  if (typeof Cstr === 'function') {
    if (opts.collectComponents) {
      const depth = getNodeDepth(elm);

      const cmp = results.components.find(c => c.tag === tagName);
      if (cmp) {
        cmp.count++;
        if (depth > cmp.depth) {
          cmp.depth = depth;
        }

      } else {
        results.components.push({
          tag: tagName,
          count: 1,
          depth: depth
        });
      }
    }

    try {
      const instance = new Cstr(elm);
      if (typeof instance.connectedCallback === 'function') {
        instance.connectedCallback();
      }

    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }
}


function getNodeDepth(elm: Node) {
  let depth = 0;

  while (elm.parentNode) {
    depth++;
    elm = elm.parentNode;
  }

  return depth;
}

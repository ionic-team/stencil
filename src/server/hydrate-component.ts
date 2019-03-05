import * as d from '@declarations';
import { catchError } from '@utils';
import { connectedCallback, getComponent, registerHost } from '@platform';


export function hydrateComponent(opts: d.HydrateOptions, results: d.HydrateResults, tagName: string, elm: d.HostElement) {
  const Cstr = getComponent(tagName);
  if (Cstr != null) {
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
      if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = componentOnReady;
      }
      if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate;
      }

      registerHost(elm);
      connectedCallback(elm, Cstr.cmpMeta);

    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }
}


function componentOnReady(this: d.HostElement) {
  return Promise.resolve(this);
}

function forceUpdate(this: d.HostElement) {
  //
}


function getNodeDepth(elm: Node) {
  let depth = 0;

  while (elm.parentNode) {
    depth++;
    elm = elm.parentNode;
  }

  return depth;
}

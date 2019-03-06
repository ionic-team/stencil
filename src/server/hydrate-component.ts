import * as d from '@declarations';
import { catchError } from '@utils';
import { connectedCallback, getComponent, getHostRef, registerHost } from '@platform';


export function hydrateComponent(opts: d.HydrateOptions, results: d.HydrateResults, tagName: string, elm: d.HostElement, waitPromises: Promise<any>[]) {
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
      registerHost(elm);

      if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = function() {
          return getHostRef(this).$onReadyPromise$;
        };
      }
      if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate;
      }

      waitPromises.push(elm.componentOnReady());

      initializePropertiesFromAttributes(elm, Cstr.cmpMeta);

      connectedCallback(elm, Cstr.cmpMeta);

    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }
}


function initializePropertiesFromAttributes(elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) {
  if (cmpMeta.m == null) {
    return;
  }

  const hostRef = getHostRef(elm);

  Object.entries(cmpMeta.m)
    .filter(([_, m]) => m[0])
    .forEach(([propName, m]) => {
      const attributeName = (m[1] || propName);

      const attrValue = elm.getAttribute(attributeName);
      if (attrValue != null) {
        const propValue = (attrValue === null && typeof (elm as any)[propName] === 'boolean')
        ? false
        : attrValue;

        hostRef.$instanceValues$.set(propName, propValue);
      }
    });
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

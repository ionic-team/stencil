import * as d from '../declarations';
import { catchError } from '@utils';
import { connectElements } from './connect-elements';
import { connectedCallback, getComponent, registerHost } from '@platform';
import { proxyHostElement } from './proxy-host-element';


export function hydrateComponent(opts: d.HydrateOptions, results: d.HydrateResults, tagName: string, elm: d.HostElement, waitPromises: Promise<any>[], hydratedElements: WeakSet<any>, collectedElements: WeakSet<any>) {
  const Cstr = getComponent(tagName);

  if (Cstr != null) {
    const cmpMeta = Cstr.cmpMeta;

    if (cmpMeta != null) {
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
      if (results.hydratedCount >= opts.maxHydrateCount) {
        return;
      }
      results.hydratedCount++;

      const hydratePromise = new Promise(async resolve => {
        try {
          registerHost(elm);
          proxyHostElement(elm, cmpMeta);
          connectedCallback(elm, cmpMeta);

          await elm.componentOnReady();

        } catch (e) {
          catchError(results.diagnostics, e);
        }

        const children = elm.children;
        if (children != null) {
          for (let i = 0, ii = children.length; i < ii; i++) {
            connectElements(opts, results, children[i] as any, waitPromises, hydratedElements, collectedElements);
          }
        }

        resolve();
      });

      waitPromises.push(hydratePromise);
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

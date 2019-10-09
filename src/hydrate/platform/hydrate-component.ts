import * as d from '../../declarations';
import { BootstrapHydrateResults } from './bootstrap-hydrate';
import { cmpModules, getHostRef, registerHost } from '@platform';
import { connectedCallback } from '@runtime';
import { proxyHostElement } from './proxy-host-element';


export function hydrateComponent(win: Window, results: BootstrapHydrateResults, tagName: string, elm: d.HostElement, waitPromises: Promise<any>[]) {
  const cmpModule = cmpModules.get(tagName);
  const Cstr = cmpModule && cmpModule[tagName];

  if (Cstr != null) {
    const cmpMeta = Cstr.cmpMeta;

    if (cmpMeta != null) {
      const hydratePromise = new Promise(async resolve => {
        try {
          registerHost(elm);
          proxyHostElement(elm, cmpMeta);
          connectedCallback(elm, cmpMeta);

          await elm.componentOnReady();

          results.hydratedCount++;

          const ref = getHostRef(elm);
          const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
          if (!results.hydratedComponents.some(c => c.tag === tagName && c.mode === modeName)) {
            results.hydratedComponents.push({
              tag: tagName,
              mode: modeName
            });
          }
        } catch (e) {
          win.console.error(e);
        }

        resolve();
      });

      waitPromises.push(hydratePromise);
    }
  }
}

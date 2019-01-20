import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { proxyComponent } from './proxy-component';


export const initHostComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, proxyState?: boolean) => {
  // initHostComponent
  Cstr.cmpMeta = cmpMeta;

  if (BUILD.member && cmpMeta.members) {

    if (BUILD.observeAttr) {
      cmpMeta.attrNameToPropName = new Map();

      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      Cstr.observedAttributes = Object.entries(cmpMeta.members)
        .filter(([_, m]) => m[2]) // filter to only keep props that should match attributes
        .map(([propName, m]) =>
          (
            // if > 0, then we already know attr name the same as the prop name
            // if not > 0, then let's use the attr name given (probably has a dash in it)
            cmpMeta.attrNameToPropName.set(m[2] = (m[2] > 0 ? propName : m[2]) as string, propName),
            m[2]
          )
        );

      (Cstr as any).prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        this[cmpMeta.attrNameToPropName.get(attrName.toLowerCase())] = newValue;
      };
    }

    proxyComponent((Cstr as any).prototype, cmpMeta, proxyState);
  }

  return Cstr as any;
};

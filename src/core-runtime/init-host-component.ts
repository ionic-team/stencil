import * as d from '../declarations';
import { proxyComponent } from './proxy-component';


export const initHostComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, attrNameToPropName?: Map<string, string>) => {
  // initHostComponent
  Cstr.cmpMeta = cmpMeta;

  if (BUILD.member && cmpMeta.members) {

    if (BUILD.observeAttr) {
      attrNameToPropName = new Map();
      Cstr.observedAttributes = cmpMeta.members
        .filter(m => m[3])
        .map(m => (attrNameToPropName.set(m[0], m[3]), m[3]));

      (Cstr as any).prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        this[attrNameToPropName.get(attrName.toLowerCase())] = newValue;
      };
    }

    proxyComponent((Cstr as any).prototype, cmpMeta);
  }

  return Cstr;
};

import * as d from '../declarations';
import { proxyComponent } from './proxy-component';


export const initHostComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta) => {
  Cstr.cmpMeta = cmpMeta;

  if (BUILD.member && cmpMeta.members) {

    if (BUILD.observeAttr) {
      cmpMeta.attrNameToPropName = new Map();
      Cstr.observedAttributes = cmpMeta.members
        .filter(m => m[3])
        .map(m => (cmpMeta.attrNameToPropName.set(m[0], m[3]), m[3]));
    }

    proxyComponent((Cstr as any).prototype, cmpMeta);
  }

  return Cstr;
};
